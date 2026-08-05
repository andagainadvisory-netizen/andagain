DEPLOY THIS FOLDER  ·  andagain.ae
==================================

>> STOP. READ THE WARNING BEFORE YOU UPLOAD. <<


THE WARNING
-----------
Netlify, Vercel and Cloudflare Pages do not merge uploads. Each deploy
REPLACES the entire site with whatever you give it. Anything not in the
folder you upload stops existing.

Three pages are live on andagain.ae right now and are NOT in this folder,
because no copy of them exists anywhere on this Mac:

    andagain.ae/insights/free-zone-vs-mainland
    andagain.ae/insights/corporate-tax-new-uae-companies
    andagain.ae/insights/corporate-bank-account-uae

They are linked from the home page. If you upload this folder as-is, those
three pages are deleted and those links break.


DO THIS FIRST
-------------
Open your hosting dashboard and find out how the site currently deploys.

  A. It deploys from a Git repository (GitHub / GitLab)
     >> Best case. Do NOT upload this folder.
        Copy index.html, pathway.html and video/ into the repo, keeping the
        insights/ folder that is already there, and push. Only your changes
        go live. Nothing can be lost.

  B. It deploys by drag-and-drop
     >> You need the three insights pages before you deploy.
        Get them from whoever or whatever made them, or download the live
        site first (a site downloader will pull every page), then add them
        into this folder at:
              insights/free-zone-vs-mainland.html
              insights/corporate-tax-new-uae-companies.html
              insights/corporate-bank-account-uae.html
        Check the URLs work after deploying.

  C. You are not sure
     >> Send a screenshot of the dashboard and we will work it out. Do not
        deploy until you know. A wrong deploy here is recoverable, but only
        if the host keeps previous deploys, which not all plans do.


WHAT IS IN THIS FOLDER
----------------------
  index.html      your live home page, with two additions in "How it works":
                  stage 02 now links to the Pathway Session, and a CTA band
                  sits under the five stages. Nothing else was changed.
  pathway.html    NEW. The Pathway Session page, built from your live site's
                  own header, footer, CSS and section classes.
  video/          the 90 second film (11 MB) and three poster images
  the rest        your existing live pages, copied unchanged

  Amharic deep link for the diaspora ads:  andagain.ae/pathway?lang=am


AFTER DEPLOYING, CHECK FOUR THINGS
----------------------------------
  1. andagain.ae/pathway loads with the site header and footer
  2. The three /insights/ pages still load
  3. Press play on the video: it runs in the page, no new tab
  4. A "Book a Pathway Session" button opens the Mamo page for AED 500
