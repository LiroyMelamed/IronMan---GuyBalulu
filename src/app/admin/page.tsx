import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { mergeContentItems, getSeoMetadata } from "@/lib/content";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/admin/login");
  }

  const [contentItems, materials, projects, seo] = await Promise.all([
    prisma.siteContent.findMany({ orderBy: [{ group: "asc" }, { key: "asc" }] }),
    prisma.material.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.project.findMany({ orderBy: { sortOrder: "asc" } }),
    getSeoMetadata(),
  ]);

  return (
    <div className="p-6">
      <div className="mx-auto max-w-5xl">
        <AdminHeader userEmail={session.user.email ?? ""} />
        <AdminDashboard
          contentItems={mergeContentItems(contentItems)}
          materials={materials}
          projects={projects}
          seo={seo}
        />
      </div>
    </div>
  );
}
