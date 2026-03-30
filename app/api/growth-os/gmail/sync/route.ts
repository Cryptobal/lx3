import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  performIncrementalSync,
  performInitialSync,
} from "@/lib/growth-os/services/gmail-sync";

// GET — cron job trigger (every 15 minutes)
export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.GMAIL_SYNC_CRON_SECRET || process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!prisma) {
    return NextResponse.json({ error: "DB not available" }, { status: 500 });
  }

  try {
    const syncStates = await prisma.gmailSyncState.findMany();
    let totalSynced = 0;

    for (const state of syncStates) {
      const synced = await performIncrementalSync(state.userId);
      totalSynced += synced;
    }

    return NextResponse.json({
      ok: true,
      synced: totalSynced,
      accounts: syncStates.length,
    });
  } catch (error) {
    console.error("[Gmail Sync Cron] Error:", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}

// POST — manual trigger from UI
export async function POST(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json({ error: "DB not available" }, { status: 500 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const isInitial = body.initial === true;

    let synced: number;
    if (isInitial) {
      synced = await performInitialSync(session.user.id);
    } else {
      synced = await performIncrementalSync(session.user.id);
    }

    return NextResponse.json({ ok: true, synced });
  } catch (error) {
    console.error("[Gmail Sync Manual] Error:", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
