export type SiteContentMap = Record<string, string>;

export type SiteContentItem = {
  key: string;
  value: string;
  group: string;
  label: string;
};

export const DEFAULT_CONTENT_ITEMS: SiteContentItem[] = [
  { key: "hero_title", value: "קונה מתכות — קניית ברזל, נחושת ואלומיניום", group: "hero", label: "כותרת ראשית" },
  { key: "hero_subtitle", value: "אנחנו קונים מתכות ופסולת מתכת במחירים הוגנים. פינוי מפעלים, פרויקטי פינוי בינוי ורכישת כל סוגי המתכות — ברזל, נחושת, אלומיניום, פליז, מצברים, כבלי חשמל, מנועי חשמל ומזגנים למחזור.", group: "hero", label: "תת-כותרת" },
  { key: "hero_cta", value: "קבלו הצעת מחיר עכשיו", group: "hero", label: "כפתור CTA" },
  { key: "hero_secondary", value: "גלו את השירותים שלנו", group: "hero", label: "כפתור משני" },
  { key: "hero_image", value: "/images/hero-metal.jpg", group: "media", label: "תמונת Hero" },
  { key: "logo_image", value: "/logo.png", group: "media", label: "לוגו" },
  { key: "materials_title", value: "מתכות שאנחנו קונים", group: "materials", label: "כותרת מתכות" },
  { key: "materials_subtitle", value: "אנחנו קונים את כל סוגי המתכות והפסולת התעשייתית — לא מוכרים. מחירים תחרותיים, איסוף מהיר ותשלום מיידי.", group: "materials", label: "תת-כותרת מתכות" },
  { key: "value_block_1_title", value: "קניית ברזל ומתכות", group: "services", label: "בלוק 01 — כותרת" },
  { key: "value_block_1_description", value: "רכישת ברזל, נחושת, אלומיניום וכל סוגי המתכות — במחירים הוגנים ובהערכה מקצועית.", group: "services", label: "בלוק 01 — תיאור" },
  { key: "value_block_2_title", value: "פינוי מפעלים ובינוי", group: "services", label: "בלוק 02 — כותרת" },
  { key: "value_block_2_description", value: "פינוי מפעלים, אתרי בנייה ופרויקטים תעשייתיים — עבודה מהירה, בטוחה ומקצועית.", group: "services", label: "בלוק 02 — תיאור" },
  { key: "value_block_3_title", value: "תשלום מיידי ואיסוף מהיר", group: "services", label: "בלוק 03 — כותרת" },
  { key: "value_block_3_description", value: "תשלום מיידי, איסוף מהיר ושירות אישי — אנחנו קונים, לא מוכרים.", group: "services", label: "בלוק 03 — תיאור" },
  { key: "projects_title", value: "פרויקטי פינוי בקנה מידה גדול", group: "projects", label: "כותרת פרויקטים" },
  { key: "projects_subtitle", value: "ניסיון מוכח בפינוי מפעלים, פינוי בינוי ופרויקטים תעשייתיים מורכבים ברחבי הארץ.", group: "projects", label: "תת-כותרת פרויקטים" },
  { key: "contact_title", value: "רוצים למכור מתכות? דברו איתנו", group: "contact", label: "כותרת יצירת קשר" },
  { key: "contact_subtitle", value: "מלאו את הטופס או שלחו הודעה ב-WhatsApp — נחזור אליכם עם הצעת מחיר תוך שעות.", group: "contact", label: "תת-כותרת יצירת קשר" },
  { key: "contact_whatsapp_cta", value: "שלחו הודעה ב-WhatsApp", group: "contact", label: "כפתור WhatsApp" },
  { key: "manager_1_name", value: "גיא בלולו", group: "contacts", label: "מנהל 1 — שם" },
  { key: "manager_1_phone", value: "+972 50-756-2842", group: "contacts", label: "מנהל 1 — טלפון" },
  { key: "manager_1_whatsapp", value: "972507562842", group: "contacts", label: "מנהל 1 — WhatsApp (ללא +)" },
  { key: "manager_2_name", value: "יוספי בלולו", group: "contacts", label: "מנהל 2 — שם" },
  { key: "manager_2_phone", value: "+972 54-330-0447", group: "contacts", label: "מנהל 2 — טלפון" },
  { key: "manager_2_whatsapp", value: "972543300447", group: "contacts", label: "מנהל 2 — WhatsApp (ללא +)" },
  { key: "footer_text", value: "© 2026 איש הברזל — קניית מתכות ופינוי מפעלים. כל הזכויות שמורות.", group: "footer", label: "טקסט פוטר" },
  { key: "nav_services", value: "שירותים", group: "nav", label: "ניווט - שירותים" },
  { key: "nav_projects", value: "פרויקטים", group: "nav", label: "ניווט - פרויקטים" },
  { key: "nav_contact", value: "צור קשר", group: "nav", label: "ניווט - צור קשר" },
];

export function mergeContentItems(items: SiteContentItem[]): SiteContentItem[] {
  const map = new Map(items.map((item) => [item.key, item]));
  return DEFAULT_CONTENT_ITEMS.map((defaults) => {
    const existing = map.get(defaults.key);
    return existing ? { ...defaults, ...existing, label: defaults.label, group: defaults.group } : defaults;
  });
}

export function getContentValue(
  content: SiteContentMap,
  key: string,
  fallback = ""
): string {
  return content[key] ?? fallback;
}

export type ManagerContact = {
  name: string;
  phone: string;
  whatsapp: string;
};

export function getManagersFromContent(content: SiteContentMap): ManagerContact[] {
  const managers = [
    {
      name: getContentValue(content, "manager_1_name"),
      phone: getContentValue(content, "manager_1_phone"),
      whatsapp: getContentValue(content, "manager_1_whatsapp"),
    },
    {
      name: getContentValue(content, "manager_2_name"),
      phone: getContentValue(content, "manager_2_phone"),
      whatsapp: getContentValue(content, "manager_2_whatsapp"),
    },
  ];

  return managers.filter((manager) => manager.name && manager.phone);
}

export function getValueBlocksFromContent(content: SiteContentMap) {
  return [
    {
      number: "01",
      title: getContentValue(content, "value_block_1_title"),
      description: getContentValue(content, "value_block_1_description"),
    },
    {
      number: "02",
      title: getContentValue(content, "value_block_2_title"),
      description: getContentValue(content, "value_block_2_description"),
    },
    {
      number: "03",
      title: getContentValue(content, "value_block_3_title"),
      description: getContentValue(content, "value_block_3_description"),
      accent: true,
    },
  ];
}
