import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { prisma } from "@/lib/db";
import { exchangeCodeForTokens } from "@/lib/growth-os/services/gmail-sync";

export async function GET(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json({ error: "DB not available" }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const userId = searchParams.get("state");

  if (!code || !userId) {
    return NextResponse.redirect(
      new URL("/admin/settings?gmail=error&reason=missing_params", request.url)
    );
  }

  try {
    const tokens = await exchangeCodeForTokens(code);

    if (!tokens.access_token) {
      return NextResponse.redirect(
        new URL("/admin/settings?gmail=error&reason=no_token", request.url)
      );
    }

    // Get the user's email from Google
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();
    const emailAddress = userInfo.data.email ?? "";

    // Store tokens in Account model
    await prisma.account.upsert({
      where: {
        provider_providerAccountId: {
          provider: "google-gmail",
          providerAccountId: emailAddress,
        },
      },
      update: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token ?? undefined,
        expires_at: tokens.expiry_date
          ? Math.floor(tokens.expiry_date / 1000)
          : undefined,
        scope: tokens.scope ?? undefined,
        token_type: tokens.token_type ?? undefined,
      },
      create: {
        userId,
        type: "oauth",
        provider: "google-gmail",
        providerAccountId: emailAddress,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: tokens.expiry_date
          ? Math.floor(tokens.expiry_date / 1000)
          : undefined,
        scope: tokens.scope ?? undefined,
        token_type: tokens.token_type ?? undefined,
      },
    });

    // Get initial historyId from Gmail profile
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    const profile = await gmail.users.getProfile({ userId: "me" });

    await prisma.gmailSyncState.upsert({
      where: { userId },
      update: {
        emailAddress,
        historyId: profile.data.historyId ?? "0",
        lastSyncAt: new Date(),
      },
      create: {
        userId,
        emailAddress,
        historyId: profile.data.historyId ?? "0",
      },
    });

    return NextResponse.redirect(
      new URL("/admin/settings?gmail=connected", request.url)
    );
  } catch (error) {
    console.error("[Gmail OAuth] Callback error:", error);
    return NextResponse.redirect(
      new URL("/admin/settings?gmail=error&reason=oauth_failed", request.url)
    );
  }
}
