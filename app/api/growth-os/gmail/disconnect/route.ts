import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST() {
  if (!prisma) {
    return NextResponse.json({ error: "DB not available" }, { status: 500 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    // Delete sync state
    await prisma.gmailSyncState.deleteMany({
      where: { userId: session.user.id },
    });

    // Delete OAuth account
    await prisma.account.deleteMany({
      where: { userId: session.user.id, provider: "google-gmail" },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[Gmail] Disconnect error:", error);
    return NextResponse.json({ error: "Failed to disconnect" }, { status: 500 });
  }
}
