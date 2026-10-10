# Deployment and operations guide

## Architecture

GoDaddy holds domain registration. Cloudflare is authoritative DNS. GitHub Pages serves the static website from `Yadukrishnan117/72BPM-website`, branch `main`, root folder. Zoho handles existing mail. A separate email Worker is prepared locally but is not deployed by GitHub Pages.

## Completed steps

1. Built the EV-led responsive landing page and revised branding, 3D product previews, UPS monitoring and partner interactions from review feedback.
2. Prepared the static single-file edition with automatic delivery pending.
3. Uploaded `index.html` to the public GitHub repository and configured Pages to deploy from `main` / `(root)`.
4. Verified successful Pages build/deploy and the new page at the default github.io URL before domain cutover.
5. Added `72-bpm.com` in GitHub Pages custom-domain settings. The user saved this setting; GitHub manages its CNAME file.
6. Added the domain to Cloudflare Free and imported 10 discovered records: two website A records, three Zoho MX records and five TXT records.
7. Inspected GoDaddy DS Records; no DS record was listed. Replaced four Route 53 nameservers with `joel.ns.cloudflare.com` and `kay.ns.cloudflare.com`. The user completed GoDaddy SMS identity verification.
8. Confirmed GoDaddy saved both Cloudflare nameservers and requested Cloudflare activation verification.
9. Replaced the old root A address with all four official GitHub Pages IPv4 addresses. Replaced www A with CNAME `yadukrishnan117.github.io`. Preserved all imported mail records. Website proxying is temporarily DNS only.
10. Verified public delegation, root A records, www CNAME and MX records. GitHub reported a successful DNS check and began certificate provisioning.

## Still required before calling deployment complete

1. In repository Settings → Pages, wait for TLS issuance to finish; enable **Enforce HTTPS** when available. Do not repeatedly remove/re-add the domain because it can restart certificate setup.
2. Verify the new page at both root and www over HTTPS with normal certificate validation. Confirm www redirects to the chosen canonical root and that no old-site cache remains.
3. Confirm Cloudflare zone status is Active and its edge certificate is ready. Configure **Full (strict)** origin TLS, then enable proxying for the four website A records and www CNAME. Preserve DNS-only mail records.
4. Verify successful HTTPS responses through Cloudflare, DDoS/security dashboard status and ordinary user interactions. Do not run attack/load tests against the live website. Do not use Under Attack Mode as an always-on substitute for normal protections.
5. Publish tested local security hardening separately. It has not yet been verified in the GitHub deployment.
6. Complete separate email-service verification, endpoint deployment and abuse controls before enabling automatic enquiries. Never put Resend credentials in HTML or GitHub source.
7. Update these documents with final evidence and date; pending items must not be represented as completed.

## Routine releases

Preview the changed page locally; check desktop/mobile navigation, WebGL fallbacks, reduced motion and enquiry feedback. Commit reviewed changes to main, inspect Actions → pages build and deployment, and verify the rendered site after deployment. Document visible changes in CHANGELOG.md. A documentation-only commit may also trigger a Pages deployment.

## Verification

Use DNS queries for NS, A, www CNAME and MX against more than one public resolver. Use `curl -I https://72-bpm.com` with normal TLS validation and inspect actual page content, not only status 200. A cached resolver may still route to the old server. Compare with GitHub settings and Cloudflare DNS. Record timestamp and evidence in the change log.

## Rollback

For a bad website release, revert the specific website commit on main and wait for Pages deployment. Preserve CNAME and documentation. For a Cloudflare proxy problem, first diagnose the TLS mode and certificates; DNS-only temporarily bypasses Cloudflare HTTP protections. For a hosting rollback, verify the previous server is still valid before restoring `15.206.29.203`. Nameserver rollback is a last resort: confirm the old Route 53 zone exists, copy all current mail records, then change registrar delegation. Propagation and caches can delay recovery.

## Access and boundaries

Use owner-managed GitHub, GoDaddy and Cloudflare accounts with MFA. Never store passwords, OTPs or API keys in the repo. GoDaddy identity checks must be completed by the account owner. DNS inventory contains public records only. Full historical Route 53 zone export was not available; custom subdomains may require separate inventory.

## References

- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
- https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https
- https://developers.cloudflare.com/ddos-protection/get-started/
- https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full-strict/
