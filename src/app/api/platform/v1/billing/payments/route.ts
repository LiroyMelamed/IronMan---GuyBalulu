import { NextResponse } from "next/server";
import { requireCentralService } from "@/lib/platform-adapter";

export async function GET(req: Request) {
  const unauthorized = requireCentralService(req);
  if (unauthorized) return unauthorized;
  return NextResponse.json({ payments: [] });
}
