import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getGmailAuthUrl } from "@/lib/growth-os/services/gmail-sync";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const authUrl = getGmailAuthUrl(session.user.id);
  return NextResponse.redirect(authUrl);
}
