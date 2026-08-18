LIDYA AFFILIATE INTEGRATION  ·  andagain.ae
===========================================
Built 18 August 2026 · Everything in this zip mirrors the repo layout.
You deploy from GitHub, so: copy these files into the repo root, keeping
the folder structure, commit, push. Nothing else in the repo is touched.


WHAT IS IN THIS ZIP
-------------------
  lidya.html          NEW. Landing page at andagain.ae/lidya - video,
                      "Chat on WhatsApp" button, and a free 30-minute
                      consultation booking form (name, email, phone and
                      topic required). Submissions open WhatsApp to AAA
                      with all details + "Referral code: LIDYA".

  index.html          REPLACES your home page. It is your current page
                      (the 5 Aug version with the Pathway additions)
                      plus one addition: a small script that captures
                      ?ref=CODE from any link, remembers it for 90 days,
                      and stamps the code into every WhatsApp message
                      the site generates (estimate form, booking form,
                      all WhatsApp buttons). Visitors without a referral
                      see no difference.
                      >> If you have edited the home page in the repo
                      since 5 August, do NOT copy this file - ask Claude
                      to re-apply just the script to your newer version.

  video/aaa-seven-steps-short.mp4     The 90-second film the landing
  video/aaa-seven-steps-poster.jpg    page plays, plus its poster frame.
                      If the repo already has these (from the pathway
                      deploy), skipping them is fine - same files.


HOW TO ADD LIDYA'S OWN VIDEO LATER
----------------------------------
Drop her clip into the repo as:  video/lidya.mp4
That is all. The landing page checks for that exact file on every load
and switches to it automatically. Until it exists, the 90-second film
plays. (MP4/H.264, under ~25 MB recommended for mobile visitors.)


AFTER DEPLOYING, CHECK THREE THINGS
-----------------------------------
  1. andagain.ae/lidya loads, on-brand, video plays in the page.
     (If /lidya without ".html" 404s on your host, use
      andagain.ae/lidya.html in her bio instead - both are wired.)
  2. Submit the booking form with test details - WhatsApp should open
     with name, email, phone, topic and "Referral code: LIDYA".
  3. Visit andagain.ae/?ref=LIDYA then tap any WhatsApp button - the
     pre-filled message should end with "Referral code: LIDYA".


HER LINKS (also in the Affiliate Link Pack PDF)
-----------------------------------------------
  Bio / primary : https://www.andagain.ae/lidya
  WhatsApp direct: https://wa.me/971559330941?text=Hello%20And%20Again%20Advisory%21%20I%20was%20referred%20by%20Lidya%20%28code%3A%20LIDYA%29.%20I%27d%20like%20to%20book%20my%20free%20consultation.
  Promo code    : LIDYA

Reference: Affiliate Promotion and Commission Agreement AAA-AFF-2026-001,
Schedule 2 (tracking routes). Do not publish this file to the website.
