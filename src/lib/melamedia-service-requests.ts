export const melamediaServiceRequestTypes = [
  "billing_setup",
  "billing_plan_change",
  "whatsapp_connect",
  "phone_number_change",
  "sms_sender_change",
  "payment_provider_setup",
] as const;

export type MelamediaServiceRequestType = (typeof melamediaServiceRequestTypes)[number];

export function isMelamediaServiceRequestType(v: string): v is MelamediaServiceRequestType {
  return (melamediaServiceRequestTypes as readonly string[]).includes(v);
}

const LABELS: Record<MelamediaServiceRequestType, string> = {
  billing_setup: "הפעלת תשלום ל-MelaMedia",
  billing_plan_change: "שינוי חבילת MelaMedia",
  whatsapp_connect: "חיבור WhatsApp Business",
  phone_number_change: "שינוי מספר טלפון עסקי",
  sms_sender_change: "שינוי מספר שולח SMS",
  payment_provider_setup: "הגדרת ספק תשלומים",
};

export function buildMelamediaServiceRequest(opts: {
  type: MelamediaServiceRequestType;
  tenantSlug: string;
  pagePath: string;
  notes?: string;
  context?: Record<string, string | undefined>;
}) {
  const label = LABELS[opts.type];
  const lines = [
    `בקשת שירות מ-IronMan · דייר: ${opts.tenantSlug}`,
    "",
    `סוג: ${label}`,
    `עמוד: ${opts.pagePath}`,
  ];
  if (opts.context) {
    for (const [k, v] of Object.entries(opts.context)) {
      if (v) lines.push(`${k}: ${v}`);
    }
  }
  if (opts.notes?.trim()) {
    lines.push("", "הערות:", opts.notes.trim());
  }
  return {
    title: `[IronMan] ${label}`,
    description: lines.join("\n"),
    metadata: {
      requestType: opts.type,
      projectId: "ironman",
      tenantSlug: opts.tenantSlug,
      pagePath: opts.pagePath,
      ...(opts.context ?? {}),
    },
  };
}
