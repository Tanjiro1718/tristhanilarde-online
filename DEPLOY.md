# Deploying www.tristhanilarde.online with Cloudflare Pages

This guide publishes the resume site with **Cloudflare Pages (Direct Upload)**,
while the domain **tristhanilarde.online** stays registered at **Hostinger**.

The site is static (HTML/CSS/JS) and needs no build command.

- Canonical URL: `https://www.tristhanilarde.online`
- Cloudflare account: sign in at <https://dash.cloudflare.com>
- Prepared upload file: `tristhanilarde-site.zip` (drag-and-drop ready)

---

## Overview

1. Add the domain to Cloudflare and change its nameservers at Hostinger.
2. Create a Cloudflare Pages project and upload the site.
3. Attach `www` and the apex domain to the Pages project.
4. Redirect the apex domain to `www`.
5. Enable HTTPS and test.

You only do steps 1, 2, and 5 once. Future updates are just a new upload.

---

## Step 1 — Add the domain to Cloudflare

1. Sign in at <https://dash.cloudflare.com>.
2. Select **Add a site** (or **Add a domain**).
3. Enter `tristhanilarde.online` and continue.
4. Choose the **Free** plan.
5. Cloudflare scans the DNS zone. Since the domain is new, it is fine if no
   important records are found. Continue.
6. Cloudflare shows **two nameservers**, for example:
   - `ada.ns.cloudflare.com`
   - `bob.ns.cloudflare.com`

   Copy both exactly. Yours will be different.

---

## Step 2 — Point Hostinger nameservers to Cloudflare

1. Sign in to **Hostinger hPanel** at <https://hpanel.hostinger.com>.
2. Go to **Domains → Domain portfolio**.
3. Select **Manage** next to `tristhanilarde.online`.
4. Open **DNS / Nameservers**.
5. Click **Change Nameservers**.
6. Choose **Change nameservers** (not "Use Hostinger nameservers").
7. Enter the two Cloudflare nameservers from Step 1 and save.
8. Return to Cloudflare and wait until the domain status becomes **Active**
   (usually 15 minutes to a few hours, up to 24–48 hours).

> The domain registration and renewal stay at Hostinger. Only DNS management
> moves to Cloudflare.

---

## Step 3 — Create the Pages project (Direct Upload)

1. In Cloudflare, go to **Workers & Pages**.
2. Select **Create application → Get started → Drag and drop your files**.
3. Project name: `tristhanilarde`
4. Drag and drop **`tristhanilarde-site.zip`** (or the `dist` folder).
5. Select **Deploy site**.

Your site is now live at:

```
https://tristhanilarde.pages.dev
```

Test that URL before moving on. Refresh with Ctrl+F5 if you see an older cached
copy.

---

## Step 4 — Attach the custom domain

1. Open the Pages project → **Custom domains**.
2. Select **Set up a domain**.
3. Add `www.tristhanilarde.online` and continue.
4. Repeat for `tristhanilarde.online`.
5. Because the domain is now a Cloudflare zone, Cloudflare creates the required
   DNS records automatically. Follow any confirmation prompts.

Both domains should show as **Active** once the certificate is issued.

---

## Step 5 — Redirect the apex domain to www

The site canonical is `https://www.tristhanilarde.online`, so the bare domain
should redirect there. Do this with a Cloudflare Redirect Rule:

1. In Cloudflare, select the `tristhanilarde.online` zone.
2. Go to **Rules → Overview**.
3. Select **Create rule → Redirect Rule**.
4. Rule name: `Apex to www`
5. Under **When incoming requests match**, choose **Wildcard pattern**.
   - **Request URL:** `https://tristhanilarde.online/*`
6. Under **Then**:
   - **Target URL:** `https://www.tristhanilarde.online/${1}`
   - **Status code:** `301`
   - **Preserve query string:** enabled
7. Select **Deploy**.

Test:

- `https://tristhanilarde.online` → redirects to `https://www.tristhanilarde.online`
- `https://tristhanilarde.online/projects` → keeps the path
- `https://www.tristhanilarde.online` → loads directly

---

## Step 6 — HTTPS

1. Cloudflare issues the certificate automatically for the Pages custom domains.
2. Go to **SSL/TLS → Edge Certificates**.
3. Enable **Always Use HTTPS**.
4. Go to **SSL/TLS → Overview** and set the mode to **Full (strict)**.

Wait a few minutes, then confirm the padlock in the browser.

---

## Step 7 — Final test checklist

- [ ] `https://www.tristhanilarde.online` loads with a padlock.
- [ ] `https://tristhanilarde.online` redirects to the `www` version.
- [ ] `http://` URLs redirect to `https://`.
- [ ] `https://www.tristhanilarde.online/does-not-exist` shows the custom 404
      page.
- [ ] CSS, JS, profile photo, and NSTP icon load.
- [ ] Dark/light theme toggle works.
- [ ] Navigation links scroll to the correct sections.
- [ ] "Copy email" shows the toast message.
- [ ] "Download PDF" opens the print dialog; "Save as PDF" produces a clean
      resume. Turn off "Headers and footers" for the cleanest result.
- [ ] GitHub, LinkedIn, Google Play, and certificate verification links work.
- [ ] `https://www.tristhanilarde.online/robots.txt` and
      `https://www.tristhanilarde.online/sitemap.xml` load.
- [ ] Mobile layout has no horizontal scrolling.

---

## Step 8 — After launch (recommended)

1. **Google Search Console** — <https://search.google.com/search-console>
   - Add `https://www.tristhanilarde.online`.
   - Verify with a DNS TXT record in Cloudflare (DNS → Records).
   - Submit `sitemap.xml`.
2. **LinkedIn** — add `https://www.tristhanilarde.online` to your profile.
3. **LinkedIn Post Inspector** —
   <https://www.linkedin.com/post-inspector/> — paste the URL to refresh the
   share preview.
4. **PageSpeed Insights** — <https://pagespeed.web.dev/>.
5. **Rich Results Test** — <https://search.google.com/test/rich-results> to
   confirm the Person structured data.

---

## Updating the site later

Cloudflare Pages deployments are immutable. To publish changes:

1. Edit the files locally.
2. In the Pages project, select **Create a new deployment**.
3. Drag in the updated folder or ZIP, then deploy.

If you edit the root files in this project, rebuild the ZIP first:

```powershell
powershell -ExecutionPolicy Bypass -File .\make-upload.ps1
```

That script recreates `tristhanilarde-site.zip` from the latest files.

---

## Troubleshooting

**Cloudflare says the domain is "Pending" / not active**
- The nameservers at Hostinger do not match the two Cloudflare gave you, or DNS
  has not propagated yet. Wait and recheck the nameservers.

**Pages project works on `*.pages.dev` but the custom domain fails**
- Add the domain through **Pages → Custom domains** (do not create the CNAME
  manually first).
- Make sure the zone is **Active** in Cloudflare.

**"Too many redirects"**
- Do not add a second apex→www redirect in Cloudflare. Keep only the Redirect
  Rule from Step 5.
- Ensure **Always Use HTTPS** is on, and SSL mode is **Full (strict)**.

**404 page is not shown**
- Cloudflare Pages serves `404.html` automatically. Confirm `404.html` is at the
  root of the uploaded folder.

**The old file still appears after an update**
- Deployments are cached at the edge. Hard-refresh (Ctrl+F5) and confirm the new
  deployment is the current production deployment.

**The share preview image is missing**
- Confirm `https://www.tristhanilarde.online/assets/og-image.jpg` loads, then
  refresh the LinkedIn Post Inspector.

**`.htaccess` is not doing anything**
- That is expected. Cloudflare Pages does not use Apache `.htaccess`. The
  equivalent rules are handled by `_headers`, Cloudflare Redirect Rules, and
  Cloudflare SSL settings. The file is kept only for the Hostinger hosting
  fallback.

---

## Files for Cloudflare Pages

Upload these (the ZIP contains exactly this set):

| File | Purpose |
| --- | --- |
| `index.html` | Resume/portfolio page |
| `styles.css` | Styles, including print/PDF layout |
| `script.js` | Theme, navigation, copy, PDF button |
| `favicon.svg` | Site icon |
| `404.html` | Custom not-found page |
| `robots.txt` | Search engine rules + sitemap URL |
| `sitemap.xml` | Sitemap |
| `_headers` | Security headers for Cloudflare Pages |
| `assets/profile.jpg` | Portrait |
| `assets/nstp-icon.png` | Project icon |
| `assets/og-image.jpg` | Social share preview |

Do **not** upload `DEPLOY.md`, `make-upload.ps1`, or `.htaccess`.

---

## Optional: Hostinger Web Hosting fallback

If you later buy Hostinger Web Hosting instead, upload the same files plus
`.htaccess` to `public_html`. The `.htaccess` file handles HTTPS, the non-www
redirect, compression, caching, the custom 404, and security headers.
