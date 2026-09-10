const CENTRAL_API_URL = (
  process.env.CENTRAL_API_URL ||
  process.env.NEXT_PUBLIC_CENTRAL_API_URL ||
  "http://127.0.0.1:4100"
).replace(/\/$/, "");

const SERVICE_KEY =
  process.env.CENTRAL_SERVICE_KEY?.trim() || "dev-central-service-key-change-me";

const PROJECT_ID = "ironman";
const TENANT_SLUG = "ironman-guy-balulu";

export function centralTicketHeaders(actor?: { userId: string; name: string; email?: string }) {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${SERVICE_KEY}`,
    "Content-Type": "application/json",
    "X-Central-Project-Id": PROJECT_ID,
    "X-Central-Tenant-Slug": TENANT_SLUG,
  };
  if (actor) headers["X-Central-Actor"] = JSON.stringify(actor);
  return headers;
}

export async function proxyCentral(path: string, init?: RequestInit) {
  const url = `${CENTRAL_API_URL}${path.startsWith("/") ? path : `/${path}`}`;
  return fetch(url, { ...init, cache: "no-store" });
}

export { PROJECT_ID, TENANT_SLUG };
