PARTNER PORTAL — DEPLOY TO andagain.ae  (Netlify + GitHub)
==========================================================

This folder moves the AAA x OSAC lead tracker fully onto your own
hosting. After these steps the portal lives at:

    andagain.ae/portal

Page, database and logins all run inside your Netlify account.
No Higgsfield anything, anywhere.


WHAT IS IN THIS FOLDER
----------------------
  portal.html                     the portal page (login + dashboard)
  netlify/functions/portal.mjs    the backend (auth + lead storage)
  package.json                    one dependency Netlify needs (@netlify/blobs)


STEP 1 — PUT THE FILES IN YOUR SITE REPO
----------------------------------------
Copy into the ROOT of the GitHub repository that deploys andagain.ae,
keeping the same layout:

    repo/
      portal.html            <— replaces the earlier redirect version if present
      netlify/
        functions/
          portal.mjs
      package.json           <— if the repo ALREADY has a package.json, do not
                                 replace it; just add this line inside its
                                 "dependencies": "@netlify/blobs": "^10.7.0"

Then commit and push. Netlify will deploy automatically.


STEP 2 — SET THE THREE SECRETS IN NETLIFY
-----------------------------------------
The passcodes are NOT in the code (that would make them public).
Set them once in the Netlify dashboard:

  Netlify > your site > Site configuration > Environment variables
  > Add a variable  (add all three, exactly these names):

    PORTAL_ADMIN_PASSCODE     AAA-SSW9-VGC6
    PORTAL_PARTNER_PASSCODE   OSAC-SCK8-MF4E
    PORTAL_SESSION_SECRET     ae24ee93b3c46794abdeea367d4b95b81e7cc9f987cc43d599c42e93479b8210

(Same two passcodes as before, so the guide you may have shared with
OSAC stays correct. You can change either passcode any time by editing
the variable — takes effect on the next deploy.)

Then trigger one more deploy so the variables are picked up:
  Deploys > Trigger deploy > Deploy site
(or just push any small commit).


STEP 3 — CHECK FOUR THINGS
--------------------------
  1. andagain.ae/portal shows the navy "Partner Portal" passcode screen
  2. Signing in with AAA-SSW9-VGC6 opens the ledger with an
     "And Again Advisory" badge and the Add lead / Import CSV buttons
  3. Signing in with OSAC-SCK8-MF4E shows the partner badge, and the
     add/import buttons are absent (they can only update statuses/notes)
  4. Add a test lead, change its status, see it in the Activity
     timeline, then delete it

NOTES
-----
- Data is stored in Netlify Blobs under your site — nothing external.
  It is included on all Netlify plans; no setup needed.
- The page is marked noindex and blocks search engines.
- Sessions last 60 days per device.
- The old higgsfield-hosted portal is separate; once this one works,
  tell Claude to retire it (it holds no data unless you added leads
  there in the meantime — if you did, export CSV there and import here).
