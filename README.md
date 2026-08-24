# UAE Business Pulse — Issue 03

**Week of 17–23 August 2026** · And Again Advisory

A static news article page for andagain.ae, built to match Issue 01
(`pulse-2026-07-20.html`) and Issue 02 (`pulse-2026-08-16.html`). No build
step, no framework, no external requests — plain HTML with inlined styles.

## Contents

```
pulse-2026-08-23.html      the article page
news.html                  the news archive page, already updated with
                           Issue 03 (latest), Issue 02 and Issue 01
```

No assets are included in this package on purpose: the pages reuse the
`assets/` folder already uploaded to the site root with Issue 02
(`assets/aaa-logo.svg`, `assets/news-hero.jpg`, `assets/tasa-explorer.ttf`).
There is nothing to re-upload.

## How to publish

1. Upload `pulse-2026-08-23.html` to the site root, next to `index.html`
   and the earlier pulse pages.
2. Upload `news.html` to the site root, replacing the existing one. The
   ISSUES list inside it already carries Issue 03 at the front, so the new
   issue appears as the latest briefing and the archive shows 03, 02, 01.

No script editing is needed. One caution: this news.html was built from the
copy in `_site_upload/` (05 Aug). If the live news.html was edited directly
on the server since then, beyond adding Issue 02 to the list, diff before
replacing.

## The Issue 03 entry, for reference

Already inserted at the front of `var ISSUES=[...]` in the bundled news.html:

```js
{ issue:'03', week:'Week of 17–23 August 2026', url:'pulse-2026-08-23.html',
  title:'Input VAT gets a burden of proof, the banks get bigger and safer, and Dubai hands over more homes than it has in years',
  summary:'The FTA makes input VAT recovery conditional on documented supplier checks from 01 October, the e-invoicing deadline moves to 30 October, banking assets reach AED 5.3 trillion, DIEZ zones hit 96 per cent occupancy, RAKEZ passes 50,000 companies and Dubai hands over 24,500 homes. Ten developments with our advisory perspective on each.',
  read:'11 min read', topics:'Tax · Banking · SME finance · Free zones · Property · Trade' },
```

Issue 02's entry was also added, since the local copy only listed Issue 01.

## Notes

- Anchors `#s1` through `#s10` and `#watch` are stable and safe to deep-link.
- Open Graph and Twitter card tags are set. Update the `og:url` / canonical if
  the deployed filename differs from `pulse-2026-08-23.html`.
- Breakpoint is 860px; the page collapses to a single column below it.
- Colours: navy `#06037A`, gold `#D2AA24` / `#FFD663`, cream `#FAF8F2`,
  rule `#E8E2D2`.

## Sources

Khaleej Times, The National, Gulf News, WAM, Central Bank of the UAE,
Dubai Land Department, Dubai Media Office.

---

© 2026 And Again Advisory
