# Publishing the Pathway Session page

**And Again Advisory® · andagain.ae/pathway**

Read the video section first. It is the only part that can go wrong.

---

## 01. The video decision, before anything else

The full 22 minute film is **135 MB**. That is too large for the static hosts you are using.

| Host | Single file limit | 135 MB video |
|---|---|---|
| **Cloudflare Pages** | 25 MiB, documented and enforced | Will not deploy |
| **Netlify** | No documented hard cap, but a 135 MB asset on a CDN plan burns bandwidth fast | Works, expensive |
| **Vercel** | Deployment size limits apply on the lower tiers | Likely blocked |

Two ways forward. Pick one now, because the page ships either way.

### Option A. Ship today with the short cut. Recommended for launch.

Use `aaa-seven-steps-short.mp4`. It is **11 MB**, 90 seconds, 720p, and deploys to any of the three hosts with no configuration. In `pathway/index.html` change one line:

```
data-video="video/aaa-seven-steps.mp4"
```
to
```
data-video="video/aaa-seven-steps-short.mp4"
```

The full 22 minutes stays reachable through the "Also on YouTube" link that already sits under the player. Nothing else changes. You are live in ten minutes.

### Option B. Put the full film on a host built for video.

Static site hosts are built for pages, not for 22 minute videos. Upload `aaa-seven-steps.mp4` to any of these and point the page at the URL it gives you:

- **Cloudflare R2** or **Cloudflare Stream**, if you are already on Cloudflare
- **Bunny Stream** or **Bunny CDN**, cheap and quick to set up
- **Backblaze B2** behind Cloudflare, effectively free egress

Then edit the same line:

```
data-video="https://your-cdn-url/aaa-seven-steps.mp4"
```

That is the only change. The page has no YouTube player in it either way, which is what you asked for. The video simply lives at a URL that is suited to its size.

**Do not** upload the 135 MB file to Cloudflare Pages. It will fail the deploy, not degrade quietly.

---

## 02. What to upload

```
your-deploy-root/
├── pathway/
│   ├── index.html
│   ├── fonts/          5 .woff files
│   └── video/
│       ├── aaa-seven-steps-poster.jpg
│       ├── aaa-why-we-charge-poster.jpg
│       ├── aaa-pathway-report-walkthrough-poster.jpg
│       └── aaa-seven-steps-short.mp4     <- copy this in from the AAA folder
├── netlify.toml        (Netlify only)
├── _redirects          (Cloudflare Pages, or Netlify as a fallback)
├── _headers            (Cloudflare Pages only)
└── vercel.json         (Vercel only)
```

Keep only the config file for the host you actually use. Deleting the other three avoids confusion later.

Everything inside `pathway/` uses relative paths, so the folder works at any depth. If you would rather publish it at `/pathway-session` or `/500`, just rename the folder and update the redirect rules to match.

---

## 03. Host by host

### Netlify

Drag the whole deploy root onto the Netlify dashboard, or add it to your repo and push. `netlify.toml` handles the clean URL, the cache headers and the referrer policy.

Netlify serves HTTP range requests by default, so video seeking works with no extra setup.

### Cloudflare Pages

Upload the deploy root. `_redirects` and `_headers` are read automatically from the root.

Remember the 25 MiB per-file limit. With the short cut at 11 MB you are fine. With the full film you are not.

### Vercel

Deploy the root. `vercel.json` handles rewrites, redirects and headers. Note `cleanUrls` is already on, which matches how the rest of andagain.ae behaves.

---

## 04. Check these four things after it goes live

`01` **The page loads at `andagain.ae/pathway`** with no `.html` in the URL, matching your other pages.

`02` **The Amharic toggle works** and `andagain.ae/pathway?lang=am` opens straight into Amharic. This is the link to put behind the diaspora ad set.

`03` **The video plays inline.** Press play and confirm it runs in the page rather than opening anything. If it stalls before starting, your host is not answering range requests. Check with:

```
curl -I https://andagain.ae/pathway/video/aaa-seven-steps-short.mp4
```

and look for `Accept-Ranges: bytes` in the response.

`04` **The five booking buttons open Mamo.** All of them point at
`https://business.mamopay.com/pay/andagainadvisory-9971c605c4e0`

---

## 05. Then, and only then

Add the Meta Pixel before `</head>` and fire a server-side `Purchase` event with value 500 and currency AED from the Mamo webhook. Until that is in place the ad account cannot see which conversations turned into money, and it will optimise toward cheap clicks instead of paid sessions.

Link the page from the main site once you are happy with it. The obvious places are the "How it works" section, at the point where Stage 2 is described, and the primary call to action in the hero.

---

*And Again Advisory L.L.C-FZ · Office 637, 6th Floor, Block B, Business Village, Opposite Clock Tower, Deira, Dubai · andagain.ae · info@andagain.ae · +971 55 933 0941 · +971 55 996 7220*
