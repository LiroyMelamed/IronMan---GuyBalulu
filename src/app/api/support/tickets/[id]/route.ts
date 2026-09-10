import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { centralTicketHeaders, proxyCentral } from "@/lib/central-tickets-server";

type Ctx = { params: Promise<{ id: string }> };

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return {
    actor: {
      userId: session.user.email ?? "admin",
      name: session.user.name ?? "CMS Admin",
    },
  };
}

export async function GET(_req: NextRequest, ctx: Ctx) {
  const auth = await requireAdmin();
  if (!auth) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const { id } = await ctx.params;
  const res = await proxyCentral(`/api/v1/tickets/${id}?include=details`, {
    headers: centralTicketHeaders(auth.actor),
  });
  return new NextResponse(await res.text(), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
