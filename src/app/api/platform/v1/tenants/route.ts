import { NextResponse } from "next/server";
import { buildTenants, requireCentralService } from "@/lib/platform-adapter";

export async function GET(req: Request) {
  const unauthorized = requireCentralService(req);
  if (unauthorized) return unauthorized;
  try {
    return NextResponse.json(await buildTenants());
  } catch (err) {
    return NextResponse.json(
      {
        error: "TENANTS_UNAVAILABLE",
        message: err instanceof Error ? err.message : String(err),
        tenants: [],
      },
      { status: 503 },
    );
  }
}
