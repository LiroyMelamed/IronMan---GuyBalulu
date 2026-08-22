"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DEFAULT_CONTENT_ITEMS } from "@/lib/content";
import { z } from "zod";

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}

const contentSchema = z.object({
  key: z.string().min(1),
  value: z.string().min(1),
});

export async function updateSiteContent(formData: FormData) {
  await requireAuth();

  const key = formData.get("key") as string;
  const value = formData.get("value") as string;

  const parsed = contentSchema.safeParse({ key, value });
  if (!parsed.success) {
    return { success: false, error: "Invalid input" };
  }

  await prisma.siteContent.update({
    where: { key: parsed.data.key },
    data: { value: parsed.data.value },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function updateAllContent(items: { key: string; value: string }[]) {
  await requireAuth();

  for (const item of items) {
    const parsed = contentSchema.safeParse(item);
    if (!parsed.success) continue;

    const defaults = DEFAULT_CONTENT_ITEMS.find((entry) => entry.key === parsed.data.key);

    await prisma.siteContent.upsert({
      where: { key: parsed.data.key },
      update: { value: parsed.data.value },
      create: {
        key: parsed.data.key,
        value: parsed.data.value,
        group: defaults?.group ?? "general",
        label: defaults?.label ?? parsed.data.key,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

const materialSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  keyword: z.string().min(1),
  icon: z.string().default("metal"),
  imageUrl: z.string().optional().nullable(),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
});

export async function upsertMaterial(data: z.infer<typeof materialSchema>) {
  await requireAuth();

  const parsed = materialSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Invalid input" };
  }

  const { id, ...rest } = parsed.data;

  if (id) {
    await prisma.material.update({ where: { id }, data: rest });
  } else {
    await prisma.material.create({ data: rest });
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteMaterial(id: string) {
  await requireAuth();
  await prisma.material.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  imageUrl: z.string().optional().nullable(),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
});

export async function upsertProject(data: z.infer<typeof projectSchema>) {
  await requireAuth();

  const parsed = projectSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Invalid input" };
  }

  const { id, ...rest } = parsed.data;

  if (id) {
    await prisma.project.update({ where: { id }, data: rest });
  } else {
    await prisma.project.create({ data: rest });
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteProject(id: string) {
  await requireAuth();
  await prisma.project.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

const seoSchema = z.object({
  pageTitle: z.string().min(1),
  metaDescription: z.string().min(1),
  keywords: z.string().min(1),
  ogTitle: z.string().min(1),
  ogDescription: z.string().min(1),
  canonicalUrl: z.string().url(),
  businessName: z.string().min(1),
  businessPhone: z.string().min(1),
  businessEmail: z.string().email(),
  businessAddress: z.string().min(1),
  businessCity: z.string().min(1),
  businessRegion: z.string().min(1),
  businessPostal: z.string().min(1),
});

export async function updateSeoMetadata(data: z.infer<typeof seoSchema>) {
  await requireAuth();

  const parsed = seoSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Invalid input" };
  }

  const existing = await prisma.seoMetadata.findFirst();
  if (existing) {
    await prisma.seoMetadata.update({
      where: { id: existing.id },
      data: parsed.data,
    });
  } else {
    await prisma.seoMetadata.create({ data: parsed.data });
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}
