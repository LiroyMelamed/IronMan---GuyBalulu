import { NextResponse } from "next/server";
import { buildMetrics, requireCentralService } from "@/lib/platform-adapter";

export async function GET(req: Request) {
  const unauthorized = requireCentralService(req);
  if (unauthorized) return unauthorized;
  try {
    return NextResponse.json(await buildMetrics());
  } catch (err) {
    return NextResponse.json({
      productId: "ironman",
      ts: new Date().toISOString(),
      extras: {
        unavailable: true,
        message: err instanceof Error ? err.message : String(err),
      },
    });
  }
}
