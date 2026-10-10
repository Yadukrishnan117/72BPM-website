# 72BPM Solutions — Code That Breathes

Responsive EV software and Industrial IoT landing page for 72BPM Solutions Private Limited, Trivandrum, Kerala. Includes animated EV charging previews, a 72 BPM particle wave, an interactive UPS battery model, partner showcases and a project enquiry form.

## Deployment status

Status recorded 11 October 2026 (IST). GitHub Pages publishes `main` / `(root)`. Custom domain: **72-bpm.com**. Public DNS now points to GitHub Pages through Cloudflare DNS. GitHub's DNS check has succeeded, but TLS issuance is still pending at this documentation checkpoint. Enforce HTTPS and Cloudflare proxy/DDoS activation are not yet complete. Automatic email delivery is also pending; the form must not claim a message was sent.

- Intended website: https://72-bpm.com
- Repository: https://github.com/Yadukrishnan117/72BPM-website
- [Deployment and rollback guide](DEPLOYMENT.md)
- [DNS inventory](DNS-RECORDS.md) and [machine-readable snapshot](dns-records.json)
- [Change log](CHANGELOG.md)
- [Security controls and limitations](SECURITY.md)

## Local preview

The public site is a single `index.html` with embedded branding. From this folder run `python3 -m http.server 8765`, then open http://localhost:8765. Internet access is needed for CDN libraries. No build step is required for GitHub Pages.

## Publishing changes

Review and commit website changes to `main`. GitHub's Pages build/deployment runs automatically. Verify the Actions result and the actual rendered custom-domain site after each release. Preserve `CNAME` with `72-bpm.com`. Keep credentials, API keys and private client data out of this public repository.

## Enquiries and maintenance

Business contact: hello@72-bpm.com. GitHub Pages cannot execute the prepared email backend. Delivery needs a separately deployed, verified service and server-held credentials. See SECURITY.md before enabling it. Dashboard readings are demonstrations, not live customer data.

Historical visual revisions are reconstructed in CHANGELOG.md; they were not all individual Git commits. Update the deployment status and DNS snapshot whenever hosting changes.
