import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PRODUCT_ID = "ironman" as const;

export function requireCentralService(req: Request): NextResponse | null {
  const key = process.env.CENTRAL_SERVICE_KEY?.trim() || "dev-central-service-key-change-me";
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer ") || header.slice(7).trim() !== key) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  return null;
}

export async function pingDb(): Promise<{ ok: boolean; latencyMs: number }> {
  const started = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { ok: true, latencyMs: Date.now() - started };
  } catch {
    return { ok: false, latencyMs: Date.now() - started };
  }
}

export async function buildHealth() {
  const dbPing = await pingDb();
  return {
    ok: dbPing.ok,
    productId: PRODUCT_ID,
    version: process.env.npm_package_version ?? "0.1.0",
    gitSha: process.env.GIT_SHA ?? undefined,
    ts: new Date().toISOString(),
    db: dbPing,
  };
}

export async function buildTenants() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://theironman.co.il";
  const [materials, projects] = await Promise.all([
    prisma.material.count({ where: { isActive: true } }),
    prisma.project.count({ where: { isActive: true } }),
  ]);

  return {
    tenants: [
      {
        id: "ironman",
        slug: "ironman",
        name: "איש הברזל — גיא בלולו",
        status: "active" as const,
        adminUrl: `${siteUrl}/admin`,
        metrics: {
          userCount: materials + projects,
        },
        createdAt: undefined,
      },
    ],
  };
}

export async function buildMetrics() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [materials, projects, contentKeys, adminUsers] = await Promise.all([
    prisma.material.count({ where: { isActive: true } }),
    prisma.project.count({ where: { isActive: true } }),
    prisma.siteContent.count(),
    prisma.user.count(),
  ]);

  return {
    productId: PRODUCT_ID,
    ts: new Date().toISOString(),
    activeTenants: 1,
    activeUsers24h: adminUsers,
    extras: {
      activeMaterials: materials,
      activeProjects: projects,
      cmsKeys: contentKeys,
      adminUsers,
    },
  };
}

export async function buildBillingSummary() {
  return {
    productId: PRODUCT_ID,
    ts: new Date().toISOString(),
    mrrCents: 0,
    billingStatus: "none" as const,
    pastDue: false,
    currency: "ILS",
    plan: "client/hosted",
  };
}
