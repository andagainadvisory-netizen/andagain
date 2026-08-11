// AAA x OSAC Lead Portal - backend (Netlify Function v2)
// Lives at /api/portal on andagain.ae. Storage: Netlify Blobs.
// Roles: "aaa" (And Again Advisory - full control),
//        "osac" (partner - view, status updates, notes).
import { getStore } from "@netlify/blobs";

export const config = { path: "/api/portal" };

const COOKIE = "aaa_portal";
const SESSION_DAYS = 60;
const STATUSES = [
  "New",
  "Contacted",
  "Meeting / Viewing",
  "Negotiation",
  "Closed - Won",
  "Closed - Lost",
  "Unreachable",
];
const FIELDS = [
  "name",
  "phone",
  "email",
  "nationality",
  "interest",
  "property_type",
  "budget",
  "area",
  "notes",
  "referred_by",
];

// ---------------------------------------------------------------- helpers
const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });

const toHex = (buf) =>
  Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

async function hmac(payload, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return toHex(await crypto.subtle.sign("HMAC", key, enc.encode(payload)));
}

const secret = () => process.env.PORTAL_SESSION_SECRET || "unset-secret";

async function makeCookie(role) {
  const maxAge = 60 * 60 * 24 * SESSION_DAYS;
  const exp = Date.now() + maxAge * 1000;
  const payload = `${role}.${exp}`;
  const sig = await hmac(payload, secret());
  return `${COOKIE}=${payload}.${sig}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

const clearCookie = () =>
  `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;

async function roleFrom(req) {
  const m = (req.headers.get("cookie") || "").match(
    new RegExp("(?:^|;\\s*)" + COOKIE + "=([^;]+)"),
  );
  if (!m) return null;
  const parts = m[1].split(".");
  if (parts.length !== 3) return null;
  const [role, expStr, sig] = parts;
  if (role !== "aaa" && role !== "osac") return null;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return null;
  if (sig !== (await hmac(`${role}.${expStr}`, secret()))) return null;
  return role;
}

function checkPasscode(code) {
  const c = (code || "").trim();
  if (!c) return null;
  if (process.env.PORTAL_ADMIN_PASSCODE && c === process.env.PORTAL_ADMIN_PASSCODE)
    return "aaa";
  if (
    process.env.PORTAL_PARTNER_PASSCODE &&
    c === process.env.PORTAL_PARTNER_PASSCODE
  )
    return "osac";
  return null;
}

const clean = (input) => {
  const out = {};
  for (const f of FIELDS)
    out[f] =
      typeof input?.[f] === "string" ? input[f].trim().slice(0, 1000) : "";
  return out;
};

const store = () => getStore({ name: "aaa-lead-portal", consistency: "strong" });
const key = (id) => `lead_${id}`;
const actor = (role) => (role === "aaa" ? "AAA" : "OSAC");

const event = (role, type, status, comment) => ({
  id: crypto.randomUUID(),
  actor: actor(role),
  type,
  status: status ?? null,
  comment: comment ?? null,
  created_at: new Date().toISOString(),
});

// ---------------------------------------------------------------- handler
export default async (req) => {
  const url = new URL(req.url);
  const role = await roleFrom(req);

  if (req.method === "GET") {
    const op = url.searchParams.get("op") || "me";
    if (op === "me") return json({ role });
    if (!role) return json({ error: "Not signed in." }, 401);
    const s = store();

    if (op === "list") {
      const { blobs } = await s.list({ prefix: "lead_" });
      const leads = (
        await Promise.all(blobs.map((b) => s.get(b.key, { type: "json" })))
      )
        .filter(Boolean)
        .map(({ events, ...lead }) => lead);
      leads.sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1));
      return json({ role, leads });
    }

    if (op === "detail") {
      const id = url.searchParams.get("id") || "";
      const lead = await s.get(key(id), { type: "json" });
      if (!lead) return json({ error: "Lead not found." }, 404);
      const events = [...(lead.events || [])].sort((a, b) =>
        a.created_at < b.created_at ? 1 : -1,
      );
      return json({ lead: { ...lead, events: undefined }, events });
    }

    return json({ error: "Unknown request." }, 400);
  }

  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }
  const op = body.op || "";

  if (op === "login") {
    const r = checkPasscode(body.passcode);
    if (!r) return json({ error: "That passcode is not recognized." }, 401);
    return json({ role: r }, 200, { "set-cookie": await makeCookie(r) });
  }
  if (op === "logout") return json({ role: null }, 200, { "set-cookie": clearCookie() });

  if (!role) return json({ error: "Not signed in." }, 401);
  const s = store();
  const now = new Date().toISOString();

  // AAA-only operations
  if (["create", "import", "update", "delete"].includes(op) && role !== "aaa")
    return json({ error: "Your access level does not allow this action." }, 403);

  if (op === "create") {
    const lead = clean(body.lead);
    if (!lead.name) return json({ error: "Name is required." }, 400);
    const id = crypto.randomUUID();
    await s.setJSON(key(id), {
      id,
      ...lead,
      status: "New",
      created_at: now,
      updated_at: now,
      events: [event(role, "created", "New", null)],
    });
    return json({ ok: true, id });
  }

  if (op === "import") {
    const items = Array.isArray(body.leads) ? body.leads : [];
    if (!items.length) return json({ error: "No leads to import." }, 400);
    if (items.length > 500)
      return json({ error: "Import is limited to 500 leads at a time." }, 400);
    let imported = 0,
      skipped = 0;
    for (const raw of items) {
      const lead = clean(raw);
      if (!lead.name) {
        skipped++;
        continue;
      }
      const id = crypto.randomUUID();
      await s.setJSON(key(id), {
        id,
        ...lead,
        status: "New",
        created_at: now,
        updated_at: now,
        events: [event(role, "created", "New", null)],
      });
      imported++;
    }
    return json({ ok: true, imported, skipped });
  }

  const id = typeof body.id === "string" ? body.id : "";
  if (!id) return json({ error: "Missing lead id." }, 400);
  const existing = await s.get(key(id), { type: "json" });
  if (!existing && op !== "delete") return json({ error: "Lead not found." }, 404);

  if (op === "update") {
    const lead = clean(body.lead);
    if (!lead.name) return json({ error: "Name is required." }, 400);
    await s.setJSON(key(id), {
      ...existing,
      ...lead,
      updated_at: now,
      events: [event(role, "edited", null, null), ...(existing.events || [])],
    });
    return json({ ok: true });
  }

  if (op === "delete") {
    await s.delete(key(id));
    return json({ ok: true });
  }

  if (op === "status") {
    const status = body.status;
    const comment =
      typeof body.comment === "string" ? body.comment.trim().slice(0, 2000) : "";
    if (!STATUSES.includes(status)) return json({ error: "Unknown status." }, 400);
    await s.setJSON(key(id), {
      ...existing,
      status,
      updated_at: now,
      events: [
        event(role, "status", status, comment || null),
        ...(existing.events || []),
      ],
    });
    return json({ ok: true });
  }

  if (op === "comment") {
    const comment =
      typeof body.comment === "string" ? body.comment.trim().slice(0, 2000) : "";
    if (!comment) return json({ error: "Comment is empty." }, 400);
    await s.setJSON(key(id), {
      ...existing,
      updated_at: now,
      events: [event(role, "comment", null, comment), ...(existing.events || [])],
    });
    return json({ ok: true });
  }

  return json({ error: "Unknown action." }, 400);
};
