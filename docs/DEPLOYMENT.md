# Deployment guide (Vercel + Namecheap)

Nothing in this guide has been executed. Do not change DNS or promote to production before the
launch checklist is complete.

## 1. Create the Vercel project

1. Push this repository to GitHub and import it at vercel.com → **Add New → Project**.
2. Framework preset: **Next.js** (defaults for build and output are correct). Node.js 22.
3. Add the environment variables from `.env.example` (Production and Preview):
   `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_CONTACT_PHONE`,
   `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`.
   `NEXT_PUBLIC_*` values are compiled into the pages — redeploy after changing them.
4. Deploy. Preview deployments are automatically `noindex` and serve `Disallow: /`
   (only `VERCEL_ENV=production` is indexable).

## 2. Contact form e-mail (Resend)

1. Create a Resend account and add a **sending subdomain**, e.g. `mail.socialmediakomplett.de`.
   Using a subdomain keeps the new SPF/DKIM records separate from the existing mailboxes.
2. Add the DNS records Resend shows (they are all on the `mail` / `resend._domainkey.mail` hosts).
   They are additional records — do not edit the existing root records.
3. Create an API key with sending access → `RESEND_API_KEY`.
4. `CONTACT_FROM_EMAIL="Social Media Komplett <anfrage@mail.socialmediakomplett.de>"`,
   `CONTACT_TO_EMAIL=` the business mailbox that should receive enquiries.
5. Send a test enquiry on the preview deployment and confirm it arrives (check spam).
   Until these variables are set the form shows an honest "could not be sent" message.

Rate limiting is in-memory per server instance (5 enquiries / 10 min / IP) on top of a honeypot and
a timing check. If you see abuse, replace the store in `src/lib/rate-limit.ts` with a shared one
(e.g. Upstash Redis) or enable Vercel's firewall rate limiting for POST requests.

## 3. Point the domain to Vercel without disrupting e-mail

**Rule: only add/change the web records (`A` for `@`, `CNAME` for `www`). Never touch `MX`, the
SPF `TXT` record, DKIM (`…_domainkey`) or `_dmarc`.**

1. In Vercel: Project → **Settings → Domains** → add `socialmediakomplett.de` and
   `www.socialmediakomplett.de`. Choose `socialmediakomplett.de` as primary and let `www`
   redirect to it (308). Vercel now displays the exact record values to use — use those values;
   the ones below are the usual defaults.
2. In Namecheap: **Domain List → Manage → Advanced DNS**.
   First take a screenshot / export of all existing records.
3. Keep the nameservers as they are ("Namecheap BasicDNS" or whatever currently serves the
   mailboxes). **Do not switch to Vercel nameservers** — that would drop the mail records.
4. In "Host Records":
   - Remove only parking/redirect entries for the website: a `CNAME` on `www` pointing to
     `parkingpage.namecheap.com` and any `URL Redirect Record` on `@`.
   - Add `A Record` — Host `@` — Value: the IP shown by Vercel (commonly `76.76.21.21`) — TTL Automatic.
   - Add `CNAME Record` — Host `www` — Value: the target shown by Vercel (commonly `cname.vercel-dns.com.`).
5. Leave everything under "Mail Settings" and all `MX`, `TXT` (`v=spf1 …`), `…._domainkey` and
   `_dmarc` records exactly as they are. If the mailboxes are Namecheap Private Email, the
   "Mail Settings" dropdown must stay on "Private Email".
6. Wait for Vercel to show "Valid Configuration" (minutes to a few hours). HTTPS certificates are
   issued automatically.
7. Verify:
   ```bash
   dig +short A socialmediakomplett.de          # Vercel IP
   dig +short CNAME www.socialmediakomplett.de  # Vercel target
   dig +short MX socialmediakomplett.de         # unchanged
   dig +short TXT socialmediakomplett.de        # SPF unchanged
   dig +short TXT _dmarc.socialmediakomplett.de # unchanged
   ```
   Then send and receive a test e-mail on an existing mailbox.

## 4. Canonical domain and HTTPS

- Canonical origin is `https://socialmediakomplett.de` (`NEXT_PUBLIC_SITE_URL`). All canonicals,
  hreflang URLs, the sitemap and structured data use it.
- `www` → apex and `http` → `https` redirects are handled by Vercel's domain settings.
- The app sends HSTS and basic security headers (`next.config.ts`).

## 5. After going live

1. Open `/robots.txt` and `/sitemap.xml` on the live domain (must list the live URLs).
2. Add the domain property in Google Search Console and Bing Webmaster Tools (DNS `TXT`
   verification is an additional record) and submit the sitemap.
3. Test a few URLs in Google's Rich Results Test and the Schema Markup Validator.
4. Run PageSpeed Insights on the live home page and one article, mobile and desktop.
