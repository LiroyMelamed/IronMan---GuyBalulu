import { NextResponse } from "next/server";
import { buildHealth, requireCentralService } from "@/lib/platform-adapter";

export async function GET(req: Request) {
  const unauthorized = requireCentralService(req);
  if (unauthorized) return unauthorized;
  try {
    return NextResponse.json(await buildHealth());
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        productId: "ironman",
        version: "0.1.0",
        ts: new Date().toISOString(),
        db: { ok: false },
        extras: { error: err instanceof Error ? err.message : String(err) },
      },
      { status: 200 },
    );
  }
}
