import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { centralTicketHeaders, PROJECT_ID, proxyCentral, TENANT_SLUG } from "@/lib/central-tickets-server";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return {
    actor: {
      userId: session.user.email ?? "admin",
      name: session.user.name ?? "CMS Admin",
      email: session.user.email ?? undefined,
    },
  };
}

export async function GET() {
  const auth = await requireAdmin();
  if (!auth) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const res = await proxyCentral(
    `/api/v1/tickets?projectId=${PROJECT_ID}&tenantSlug=${TENANT_SLUG}&limit=100`,
    { headers: centralTicketHeaders(auth.actor) },
  );
  return new NextResponse(await res.text(), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const body = await request.json();
  const res = await proxyCentral("/api/v1/tickets", {
    method: "POST",
    headers: centralTicketHeaders(auth.actor),
    body: JSON.stringify({
      title: body.title,
      description: body.description,
      projectId: PROJECT_ID,
      tenantSlug: TENANT_SLUG,
      source: "admin",
      createdBy: auth.actor,
      metadata: { path: "/admin/support" },
    }),
  });
  return new NextResponse(await res.text(), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
