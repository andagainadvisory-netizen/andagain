// AAA cost estimator - estimate delivery (Netlify Function v2)
// POST /api/send-estimate  ->  emails the visitor their estimate
// from info@andagain.ae via Microsoft Graph (client credentials).
//
// Required environment variables (Netlify > Site settings > Environment):
//   GRAPH_TENANT_ID      Azure AD tenant id
//   GRAPH_CLIENT_ID      app registration client id
//   GRAPH_CLIENT_SECRET  client secret value
//   ESTIMATE_SENDER      optional, defaults to info@andagain.ae
//
// Until those are set the function answers 503 {sent:false,
// reason:"not-configured"} and the page falls back gracefully.

export const config = { path: "/api/send-estimate" };

const SENDER_DEFAULT = "info@andagain.ae";
const MAX_BODY = 60000;          // bytes of request JSON
const RATE_LIMIT = 5;            // sends per IP...
const RATE_WINDOW = 60 * 60e3;   // ...per hour (best effort, per instance)

const hits = new Map();

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });

// Every client-supplied string passes through here before entering HTML.
const escapeHtml = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const clip = (s, n) => String(s ?? "").slice(0, n);
const validEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(s ?? "").trim());

function rateLimited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW);
  if (list.length >= RATE_LIMIT) return true;
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear(); // memory backstop
  return false;
}

// ------------------------------------------------------------------ email
function rowsHtml(rows) {
  return rows
    .map(
      (r) => `<tr>
        <td style="padding:7px 4px;border-bottom:1px solid #E5E1D4;font-size:13px;color:#16142E">
          ${escapeHtml(r.l)}${r.d ? `<br><span style="font-size:11px;color:#6B7280">${escapeHtml(r.d)}</span>` : ""}
        </td>
        <td style="padding:7px 10px;border-bottom:1px solid #E5E1D4;font-size:11px;color:#6B7280;text-align:right;white-space:nowrap">${escapeHtml(r.q || "")}</td>
        <td style="padding:7px 4px;border-bottom:1px solid #E5E1D4;font-size:13px;font-weight:700;color:#16142E;text-align:right;white-space:nowrap">${escapeHtml(r.v)}</td>
      </tr>`
    )
    .join("");
}

function zoneHtml(z) {
  return `
  <div style="border:1px solid #E5E1D4;margin:0 0 18px">
    <div style="background:#06037A;color:#fff;padding:14px 18px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="font-size:16px;font-weight:800">${escapeHtml(z.name)}</td>
        <td style="text-align:right;font-size:18px;font-weight:800;color:#FFD663">AED ${escapeHtml(z.total)}</td>
      </tr><tr>
        <td style="font-size:11px;color:#B3AFD6">${escapeHtml(z.emirate)} &middot; ${escapeHtml(z.pack)}</td>
        <td style="text-align:right;font-size:11px;color:#B3AFD6">year one, all in</td>
      </tr></table>
    </div>
    <div style="padding:14px 18px">
      <p style="margin:0 0 4px;font-size:12px;font-weight:800;color:#06037A;border-bottom:2px solid #06037A;padding-bottom:5px">
        Section A &middot; Authority cost &mdash; paid directly to the authority, no markup</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rowsHtml(z.aRows)}
        <tr><td style="padding:8px 4px;font-size:13px;font-weight:800;color:#06037A">Total, Section A</td><td></td>
        <td style="padding:8px 4px;font-size:13px;font-weight:800;color:#06037A;text-align:right">${escapeHtml(z.a)}</td></tr>
      </table>
      <p style="margin:14px 0 4px;font-size:12px;font-weight:800;color:#06037A;border-bottom:2px solid #06037A;padding-bottom:5px">
        Section B &middot; And Again Advisory &mdash; our fee, no VAT charged</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rowsHtml(z.bRows)}
        <tr><td style="padding:8px 4px;font-size:13px;font-weight:800;color:#06037A">Total, Section B</td><td></td>
        <td style="padding:8px 4px;font-size:13px;font-weight:800;color:#06037A;text-align:right">${escapeHtml(z.b)}</td></tr>
      </table>
      <p style="margin:12px 0 0;padding:10px 14px;background:#06037A;color:#fff;font-size:13px">
        Year one total &nbsp;${escapeHtml(z.a)} + ${escapeHtml(z.b)} =
        <b style="color:#FFD663">AED ${escapeHtml(z.total)}</b></p>
      ${z.threeYear ? `<p style="margin:10px 0 0;font-size:12px;color:#6B7280"><b style="color:#16142E">Authority cost over three years:</b> ${escapeHtml(z.threeYear)}</p>` : ""}
    </div>
  </div>`;
}

function emailHtml(p) {
  const specList = p.specLines
    .map((s) => `<li style="margin:0 0 5px;font-size:13px;color:#16142E">${escapeHtml(s)}</li>`)
    .join("");
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#FAF8F2;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
  <div style="max-width:640px;margin:0 auto;padding:28px 16px">
    <div style="background:#06037A;padding:22px 26px">
      <p style="margin:0;font-size:19px;font-weight:800;color:#fff;letter-spacing:.02em">AND AGAIN <span style="color:#D2AA24">ADVISORY</span><span style="font-size:11px;color:#fff">&reg;</span></p>
      <p style="margin:4px 0 0;font-size:11px;letter-spacing:.22em;color:#B3AFD6;text-transform:uppercase">UAE Business Setup &amp; Market Entry</p>
    </div>
    <div style="background:#fff;border:1px solid #E5E1D4;border-top:0;padding:26px">
      <p style="margin:0 0 14px;font-size:15px;color:#16142E">Dear ${escapeHtml(p.firstName)},</p>
      <p style="margin:0 0 18px;font-size:14px;color:#16142E;line-height:1.65">
        Thank you for using our cost estimator. Your estimate is below, exactly as calculated &mdash;
        every government fee itemised at cost, our fee stated separately. They meet only at the total.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F2EEE2;margin:0 0 20px">
        <tr>
          <td style="padding:12px 16px;font-size:11px;color:#6B7280">Reference<br><b style="font-size:13px;color:#06037A">${escapeHtml(p.reference)}</b></td>
          <td style="padding:12px 16px;font-size:11px;color:#6B7280">Jurisdiction<br><b style="font-size:13px;color:#06037A">${escapeHtml(p.jurisdiction)}</b></td>
          <td style="padding:12px 16px;font-size:11px;color:#6B7280">Position as at<br><b style="font-size:13px;color:#06037A">${escapeHtml(p.asOf)}</b></td>
          <td style="padding:12px 16px;font-size:11px;color:#6B7280">Valid<br><b style="font-size:13px;color:#06037A">30 days</b></td>
        </tr>
      </table>
      ${p.zones.map(zoneHtml).join("")}
      ${p.mainland ? `<div style="border:1px solid #E5E1D4;padding:16px 18px;margin:0 0 18px"><p style="margin:0 0 6px;font-size:14px;font-weight:800;color:#06037A">Dubai Mainland</p><p style="margin:0;font-size:13px;color:#16142E;line-height:1.6">A mainland quote is a single number against a pinned specification &mdash; floor area, rent, activity &mdash; so we do not put an instant figure on it. Our fee is a flat AED 5,000, any structure, any visa count. The full five-block quote follows once the specification is pinned with you.</p></div>` : ""}
      <p style="margin:20px 0 6px;font-size:13px;font-weight:800;color:#06037A">The brief we priced</p>
      <ul style="margin:0 0 20px;padding-left:18px">${specList}</ul>
      <p style="margin:0 0 16px;font-size:13px;color:#16142E;line-height:1.65">
        <b>Next step.</b> Reply to this email, or message us on WhatsApp at
        <a href="https://wa.me/971559967220" style="color:#06037A">+971 55 996 7220</a>, and we will
        confirm the current authority rates in writing and issue the formal estimate against your
        named activity. The Pathway Session &mdash; the written jurisdiction verdict, full cost split,
        visa numbers and banking readiness — is AED 500, credited in full against your setup fee.</p>
      <p style="margin:0;font-size:12px;color:#6B7280;line-height:1.6">
        Government, licensing, visa and third-party fees are payable directly to the respective
        authorities; And Again Advisory does not collect or process them unless explicitly stated.
        Figures are partner rates as at ${escapeHtml(p.asOf)}, held for 30 days, and confirmed on the
        authority payment voucher before anything is filed. This is a calculation, not an offer, and
        it does not guarantee approval, a date or a tax outcome.</p>
    </div>
    <div style="background:#04024F;padding:18px 26px">
      <p style="margin:0;font-size:12px;color:#E4E1F4;font-weight:700">And Again Advisory &middot; Build. Scale. Begin Again.</p>
      <p style="margin:6px 0 0;font-size:11px;color:#B3AFD6;line-height:1.6">
        And Again Advisory L.L.C-FZ &middot; Trade Licence 2542849.01<br>
        Meydan Grandstand, 6th Floor, Meydan Road, Nad Al Sheba, Dubai, U.A.E.<br>
        <a href="https://andagain.ae" style="color:#FFD663">andagain.ae</a> &middot; info@andagain.ae &middot; +971 55 996 7220</p>
    </div>
  </div></body></html>`;
}

// ------------------------------------------------------------------ graph
async function graphToken(tenant, id, secret) {
  const res = await fetch(
    `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: id,
        client_secret: secret,
        scope: "https://graph.microsoft.com/.default",
        grant_type: "client_credentials",
      }),
    }
  );
  if (!res.ok) throw new Error("token " + res.status);
  return (await res.json()).access_token;
}

// ------------------------------------------------------------------ handler
export default async (req, context) => {
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);

  const tenant = process.env.GRAPH_TENANT_ID;
  const clientId = process.env.GRAPH_CLIENT_ID;
  const clientSecret = process.env.GRAPH_CLIENT_SECRET;
  const sender = process.env.ESTIMATE_SENDER || SENDER_DEFAULT;
  if (!tenant || !clientId || !clientSecret)
    return json({ sent: false, reason: "not-configured" }, 503);

  const raw = await req.text();
  if (raw.length > MAX_BODY) return json({ sent: false, reason: "too-large" }, 413);

  let b;
  try { b = JSON.parse(raw); } catch { return json({ sent: false, reason: "bad-json" }, 400); }

  if (b.website) return json({ sent: true }); // honeypot: pretend success
  if (!validEmail(b.email)) return json({ sent: false, reason: "bad-email" }, 400);

  const ip = context?.ip || req.headers.get("x-nf-client-connection-ip") || "?";
  if (rateLimited(ip)) return json({ sent: false, reason: "rate-limited" }, 429);

  // Rebuild the payload defensively: caps on counts and lengths, strings only.
  const cleanRows = (rows) =>
    (Array.isArray(rows) ? rows : []).slice(0, 20).map((r) => ({
      l: clip(r?.l, 200), d: clip(r?.d, 300), q: clip(r?.q, 60), v: clip(r?.v, 40),
    }));
  const p = {
    firstName: clip(b.firstName || String(b.name || "").split(/\s+/)[0], 60) || "there",
    name: clip(b.name, 120),
    email: String(b.email).trim(),
    reference: clip(b.reference, 60) || "AAA · WEB",
    jurisdiction: clip(b.jurisdiction, 120),
    asOf: clip(b.asOf, 40) || "current month",
    mainland: !!b.mainland,
    specLines: (Array.isArray(b.specLines) ? b.specLines : []).slice(0, 15).map((s) => clip(s, 200)),
    zones: (Array.isArray(b.zones) ? b.zones : []).slice(0, 6).map((z) => ({
      name: clip(z?.name, 60), emirate: clip(z?.emirate, 40), pack: clip(z?.pack, 160),
      total: clip(z?.total, 40), a: clip(z?.a, 40), b: clip(z?.b, 40),
      threeYear: clip(z?.threeYear, 300),
      aRows: cleanRows(z?.aRows), bRows: cleanRows(z?.bRows),
    })),
  };
  if (!p.zones.length && !p.mainland)
    return json({ sent: false, reason: "empty" }, 400);

  try {
    const token = await graphToken(tenant, clientId, clientSecret);
    const res = await fetch(
      `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(sender)}/sendMail`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          message: {
            subject: `Your UAE setup estimate — ${p.reference}`,
            body: { contentType: "HTML", content: emailHtml(p) },
            toRecipients: [{ emailAddress: { address: p.email, name: p.name || undefined } }],
            replyTo: [{ emailAddress: { address: sender } }],
          },
          saveToSentItems: true,
        }),
      }
    );
    if (res.status === 202) return json({ sent: true });
    const detail = await res.text();
    console.error("sendMail failed", res.status, detail.slice(0, 500));
    return json({ sent: false, reason: "graph-" + res.status }, 502);
  } catch (e) {
    console.error("send-estimate error", e.message);
    return json({ sent: false, reason: "error" }, 502);
  }
};
