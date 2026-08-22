import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { DEFAULT_CONTENT_ITEMS } from "../src/lib/content";

const prisma = new PrismaClient();

const MATERIAL_IMAGES: Record<string, string> = {
  iron: "/images/materials/iron.jpg",
  copper: "/images/materials/copper.jpg",
  aluminum: "/images/materials/aluminum.jpg",
  battery: "/images/materials/battery.jpg",
  cable: "/images/materials/cable.jpg",
  brass: "/images/materials/brass.jpg",
  motor: "/images/materials/motor.jpg",
  ac: "/images/materials/ac.jpg",
};

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@ironman.co.il";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  const hashedPassword = await hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Admin",
      password: hashedPassword,
    },
  });

  for (const item of DEFAULT_CONTENT_ITEMS) {
    await prisma.siteContent.upsert({
      where: { key: item.key },
      update: { value: item.value, group: item.group, label: item.label },
      create: item,
    });
  }

  const materials = [
    { title: "קניית ברזל", description: "רכישת ברזל, פסולת ברזל, קonstruksiya וברזל מבנים במחירים תחרותיים.", icon: "iron", keyword: "קניית ברזל", imageUrl: MATERIAL_IMAGES.iron, sortOrder: 0 },
    { title: "קניית נחושת", description: "קונים נחושת, כבלי נחושת, צינורות וכל סוגי פסולת הנחושת.", icon: "copper", keyword: "קניית נחושת", imageUrl: MATERIAL_IMAGES.copper, sortOrder: 1 },
    { title: "קניית אלומיניום", description: "רכישת אלומיניום, פרופילים, שאריות ייצור ופסולת אלומיניום.", icon: "aluminum", keyword: "קניית אלומיניום", imageUrl: MATERIAL_IMAGES.aluminum, sortOrder: 2 },
    { title: "קניית מצברים", description: "קונים מצברים ישנים, סוללות רכב וסוללות תעשייתיות למחזור.", icon: "battery", keyword: "קניית מצברים", imageUrl: MATERIAL_IMAGES.battery, sortOrder: 3 },
    { title: "קניית כבלי חשמל", description: "רכישת כבלי חשמל, כבלי תקשורת ופסולת חשמלית מכל סוג.", icon: "cable", keyword: "קניית כבלי חשמל", imageUrl: MATERIAL_IMAGES.cable, sortOrder: 4 },
    { title: "קניית פליז", description: "קונים פליז, שבבי פליז, ברזים ורכיבי פליז ישנים.", icon: "brass", keyword: "קניית פליז", imageUrl: MATERIAL_IMAGES.brass, sortOrder: 5 },
    { title: "קניית מנועי חשמל", description: "רכישת מנועי חשמל, ממסרים, טransפורמטורים וציוד חשמלי תעשייתי.", icon: "motor", keyword: "קניית מנועי חשמל", imageUrl: MATERIAL_IMAGES.motor, sortOrder: 6 },
    { title: "קניית מזגנים למחזור", description: "קונים מזגנים ישנים, יחידות HVAC וציוד קירור למחזור.", icon: "ac", keyword: "קניית מזגנים למחזור", imageUrl: MATERIAL_IMAGES.ac, sortOrder: 7 },
  ];

  await prisma.material.deleteMany();
  await prisma.material.createMany({ data: materials });

  const projects = [
    { title: "פינוי מפעלים", description: "פינוי מפעלים שלמים — ציוד, מכונות, מתכות ופסולת תעשייתית. עבודה מהירה, מקצועית ובטוחה.", category: "פינוי מפעלים", imageUrl: "/images/projects/factory.jpg", sortOrder: 0 },
    { title: "פרויקטי פינוי בינוי", description: "פינוי אתרי בנייה, הריסות ופרויקטי בינוי — ברזל, בטון, מתכות ופסולת בניין.", category: "פרויקטי פינוי בינוי", imageUrl: "/images/projects/demolition.jpg", sortOrder: 1 },
    { title: "פינוי מחסנים ולוגיסטיקה", description: "פינוי מחסנים, מרכזי לוגיסטיקה ומתחמי אחסון — כולל רכישת המתכות שנמצאו באתר.", category: "פינוי מפעלים", imageUrl: "/images/projects/warehouse.jpg", sortOrder: 2 },
  ];

  await prisma.project.deleteMany();
  await prisma.project.createMany({ data: projects });

  await prisma.seoMetadata.deleteMany();
  await prisma.seoMetadata.create({
    data: {
      pageTitle: "קונה מתכות | קניית ברזל, נחושת, אלומיניום | פינוי מפעלים",
      metaDescription: "איש הברזל — קונה מתכות בישראל. קניית ברזל, קניית נחושת, קניית אלומיניום, קניית מצברים, קניית כבלי חשמל, קניית פליז, קניית מנועי חשמל, קניית מזגנים למחזור. פינוי מפעלים ופרויקטי פינוי בינוי.",
      keywords: "קניית ברזל, קניית נחושת, קניית אלומיניום, קניית מצברים, קניית כבלי חשמל, קניית פליז, קניית מנועי חשמל, קניית מזגנים למחזור, פינוי מפעלים, פרויקטי פינוי בינוי, קונה מתכות",
      ogTitle: "קונה מתכות — איש הברזל | קניית מתכות ופינוי מפעלים",
      ogDescription: "מחפשים למכור מתכות? אנחנו קונים ברזל, נחושת, אלומיניום, מצברים, כבלי חשמל, פליז, מנועי חשמל ומזגנים. פינוי מפעלים ופרויקטי בינוי.",
      canonicalUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
      businessName: "איש הברזל — קניית מתכות",
      businessPhone: "+972 50-756-2842",
      businessEmail: "info@ironman.co.il",
      businessAddress: "רחוב התעשייה 1",
      businessCity: "תל אביב",
      businessRegion: "מרכז",
      businessPostal: "6100000",
      latitude: 32.0853,
      longitude: 34.7818,
    },
  });

  console.log("Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
