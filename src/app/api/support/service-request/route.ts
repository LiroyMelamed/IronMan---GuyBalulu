import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  centralTicketHeaders,
  PROJECT_ID,
  proxyCentral,
  TENANT_SLUG,
} from "@/lib/central-tickets-server";
import {
  buildMelamediaServiceRequest,
  isMelamediaServiceRequestType,
} from "@/lib/melamedia-service-requests";

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

const bodySchema = z.object({
  type: z.string(),
  notes: z.string().max(4000).optional(),
  pagePath: z.string().max(500).optional(),
  context: z.record(z.string().max(500)).optional(),
});

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success || !isMelamediaServiceRequestType(parsed.data.type)) {
    return NextResponse.json({ error: "INVALID_REQUEST_TYPE" }, { status: 400 });
  }

  const pagePath = parsed.data.pagePath ?? "/admin/support";
  const built = buildMelamediaServiceRequest({
    type: parsed.data.type,
    tenantSlug: TENANT_SLUG,
    pagePath,
    notes: parsed.data.notes,
    context: parsed.data.context,
  });

  const res = await proxyCentral("/api/v1/tickets", {
    method: "POST",
    headers: centralTicketHeaders(auth.actor),
    body: JSON.stringify({
      title: built.title,
      description: built.description,
      projectId: PROJECT_ID,
      tenantSlug: TENANT_SLUG,
      source: "admin",
      createdBy: auth.actor,
      metadata: { ...built.metadata, path: pagePath },
    }),
  });

  return new NextResponse(await res.text(), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
