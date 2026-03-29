import { NextRequest, NextResponse } from "next/server";
import { processTrackingEvent } from "@/lib/growth-os/services/tracking-service";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const ip =
      req.headers.get("x-forwarded-for") ??
      req.headers.get("x-real-ip") ??
      undefined;
    const country = req.headers.get("x-vercel-ip-country") ?? undefined;
    const city = req.headers.get("x-vercel-ip-city") ?? undefined;

    await processTrackingEvent({ ...data, ip, country, city });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
