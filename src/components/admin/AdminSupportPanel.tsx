"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type Ticket = { id: string; title: string; description: string; status: string };

const STATUS_HE: Record<string, string> = {
  open: "פתוח",
  in_progress: "בתהליך",
  resolved: "טופל",
  pr_created: "טופל",
  closed: "סגור",
};

const SERVICE_REQUESTS = [
  { type: "billing_setup", title: "הפעלת תשלום ל-MelaMedia" },
  { type: "whatsapp_connect", title: "חיבור WhatsApp" },
  { type: "phone_number_change", title: "שינוי מספר טלפון" },
  { type: "payment_provider_setup", title: "הגדרת תשלומים" },
] as const;

export function AdminSupportPanel() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<{ ticket: Ticket; comments?: Array<{ body: string; author: { name: string } }> } | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [requestMsg, setRequestMsg] = useState<string | null>(null);

  async function openServiceRequest(type: string) {
    setBusy(true);
    setRequestMsg(null);
    try {
      const res = await fetch("/api/support/service-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, pagePath: "/admin/support" }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setRequestMsg("הפנייה נפתחה.");
      await loadList();
    } finally {
      setBusy(false);
    }
  }

  const loadList = useCallback(async () => {
    const res = await fetch("/api/support/tickets");
    const data = await res.json();
    setTickets(data.tickets ?? []);
  }, []);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  useEffect(() => {
    if (!selectedId) return;
    void fetch(`/api/support/tickets/${selectedId}`)
      .then((r) => r.json())
      .then(setDetail);
  }, [selectedId]);

  return (
    <div dir="rtl" lang="he" className="space-y-6">
      <Link href="/admin" className="text-sm text-terex-muted hover:text-terex-navy">
        → חזרה ל-CMS
      </Link>
      <h1 className="text-2xl font-black text-terex-navy">תמיכה</h1>
      {requestMsg ? <p className="text-sm text-green-700">{requestMsg}</p> : null}
      <div className="grid gap-2 sm:grid-cols-2">
        {SERVICE_REQUESTS.map((r) => (
          <button
            key={r.type}
            type="button"
            disabled={busy}
            onClick={() => void openServiceRequest(r.type)}
            className="rounded border border-dashed border-terex-border px-3 py-2 text-start text-sm hover:bg-terex-sand/40 disabled:opacity-50"
          >
            {r.title}
          </button>
        ))}
      </div>
      <form
        className="space-y-3 rounded-xl border border-terex-border p-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          try {
            await fetch("/api/support/tickets", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ title, description }),
            });
            setTitle("");
            setDescription("");
            await loadList();
          } finally {
            setBusy(false);
          }
        }}
      >
        <input required className="w-full rounded border px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="כותרת" />
        <textarea required rows={4} className="w-full rounded border px-3 py-2" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="תיאור" />
        <button type="submit" disabled={busy} className="rounded bg-terex-navy px-4 py-2 text-white text-sm">
          {busy ? "שולח…" : "שליחה"}
        </button>
      </form>
      <div className="grid gap-4 md:grid-cols-2">
        <ul className="space-y-2">
          {tickets.map((t) => (
            <li key={t.id}>
              <button type="button" className="w-full rounded border px-3 py-2 text-start" onClick={() => setSelectedId(t.id)}>
                <div className="font-semibold">{t.title}</div>
                <div className="text-xs text-terex-muted">{STATUS_HE[t.status] ?? t.status}</div>
              </button>
            </li>
          ))}
        </ul>
        <div className="rounded border p-4 text-sm">
          {!detail ? (
            <p className="text-terex-muted">בחרו פנייה.</p>
          ) : (
            <>
              <p className="font-bold">{detail.ticket.title}</p>
              <p className="text-terex-muted">{STATUS_HE[detail.ticket.status] ?? detail.ticket.status}</p>
              <p className="mt-2 whitespace-pre-wrap">{detail.ticket.description}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
