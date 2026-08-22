"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Send, Mail, MapPin } from "lucide-react";
import {
  TerexSection,
  TerexSectionHeader,
  TerexPanel,
  TerexLabel,
  TerexButton,
} from "@/components/ui/terex";
import { getContentValue, getManagersFromContent, type SiteContentMap } from "@/lib/content";
import { phoneToTel } from "@/lib/contacts";

interface ContactSectionProps {
  content: SiteContentMap;
  businessEmail?: string;
  businessAddress?: string;
}

export function ContactSection({
  content,
  businessEmail = "info@ironman.co.il",
  businessAddress = "המסגר 34, נתניה",
}: ContactSectionProps) {
  const [formData, setFormData] = useState({ name: "", phone: "", material: "", message: "" });
  const managers = getManagersFromContent(content);
  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ??
    getContentValue(content, "manager_1_whatsapp", "972507562842");

  const buildWhatsAppMessage = () => {
    const text = [
      "שלום, אני מעוניין/ת למכור מתכות:",
      formData.name && `שם: ${formData.name}`,
      formData.phone && `טלפון: ${formData.phone}`,
      formData.material && `סוג מתכת: ${formData.material}`,
      formData.message && `פרטים: ${formData.message}`,
    ].filter(Boolean).join("\n");
    return encodeURIComponent(text || "שלום, אני מעוניין/ת למכור מתכות. אשמח לקבל הצעת מחיר.");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(`https://wa.me/${whatsappNumber}?text=${buildWhatsAppMessage()}`, "_blank", "noopener,noreferrer");
  };

  const inputClass =
    "w-full bg-white/10 border border-white/20 px-5 py-4 text-white text-sm font-medium placeholder:text-white/40 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all";

  return (
    <TerexSection id="contact" className="bg-terex-navy" aria-labelledby="contact-heading">
      <TerexSectionHeader
        label="צור קשר"
        title={getContentValue(content, "contact_title")}
        subtitle={getContentValue(content, "contact_subtitle")}
        id="contact-heading"
        light
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 px-6 md:px-12 lg:px-16 pb-16 md:pb-24">
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <TerexPanel dark className="p-8 md:p-10">
            <TerexLabel className="!text-white/70 mb-10 block">טופס פנייה</TerexLabel>
            <form onSubmit={handleSubmit} className="space-y-5 pt-2" noValidate>
              {(
                [
                  { id: "name", label: "שם מלא", type: "text", placeholder: "הכנסו את שמכם", required: true },
                  { id: "phone", label: "טלפון", type: "tel", placeholder: "050-000-0000", required: true, dir: "ltr" },
                  { id: "material", label: "סוג מתכת", type: "text", placeholder: "ברזל, נחושת..." },
                ] as const
              ).map((field) => (
                <div key={field.id}>
                  <label htmlFor={field.id} className="block font-mono text-[10px] uppercase tracking-[0.2em] text-white/70 mb-3">
                    {field.label}
                  </label>
                  <input
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    required={"required" in field ? field.required : false}
                    dir={"dir" in field ? field.dir : undefined}
                    value={formData[field.id as keyof typeof formData]}
                    onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                    className={`${inputClass} ${"dir" in field ? "text-left" : ""}`}
                  />
                </div>
              ))}
              <div>
                <label htmlFor="message" className="block font-mono text-[10px] uppercase tracking-[0.2em] text-white/70 mb-3">
                  פרטים נוספים
                </label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="תארו כמות, מיקום..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-end">
                <TerexButton type="submit" variant="white" className="!bg-[#25D366] !border-[#25D366] hover:!bg-[#20BD5A]">
                  <MessageCircle className="h-4 w-4 ml-2" aria-hidden="true" />
                  {getContentValue(content, "contact_whatsapp_cta")}
                </TerexButton>
                <TerexButton type="submit" variant="white">
                  <Send className="h-4 w-4 ml-2" aria-hidden="true" />
                  שליחה
                </TerexButton>
              </div>
            </form>
          </TerexPanel>
        </motion.div>

        <motion.div
          className="lg:col-span-2 flex flex-col gap-4 pt-8 lg:pt-0 lg:pr-8"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {[
            ...managers.map((manager) => ({
              key: manager.name,
              label: manager.name,
              value: manager.phone,
              href: phoneToTel(manager.phone),
              dir: "ltr" as const,
            })),
            { key: "email", label: "אימייל", value: businessEmail, href: `mailto:${businessEmail}` },
            { key: "address", label: "כתובת", value: businessAddress },
          ].map((item, i) => (
            <motion.div
              key={item.key}
              className="bg-white/10 border border-white/15 p-6"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + i * 0.08 }}
            >
              <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-white/70 mb-4">
                {item.label}
              </span>
              {"href" in item && item.href ? (
                <a
                  href={item.href}
                  className="text-lg font-bold text-white/95 hover:text-white transition-colors"
                  dir={"dir" in item ? item.dir : undefined}
                >
                  {item.value}
                </a>
              ) : (
                <p className="text-lg font-bold text-white/95">{item.value}</p>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </TerexSection>
  );
}
