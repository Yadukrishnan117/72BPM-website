# Security status and reporting

## Verified deployment boundaries — 11 October 2026 IST

The public site is static on GitHub Pages. The email backend is not deployed there and automatic delivery remains pending. Cloudflare now hosts DNS, but website records are DNS only while GitHub requests the custom-domain certificate. Enforce HTTPS and Cloudflare HTTP DDoS protection are not yet confirmed active. No claim of complete security or penetration testing is made.

The site contains illustrative monitoring data, not live customer telemetry. Email secrets belong in server-side secret storage, never public HTML. The enquiry UI must show failure/pending status rather than claim delivery when its endpoint is unavailable.

## Prepared locally; not yet verified deployed

- Version-pinned Tailwind CDN and SHA384 integrity checks for Three.js, GSAP and Lucide. Tailwind has no SRI because its response does not support the needed cross-origin loading behavior.
- Referrer policy and limited CSP directives for objects, base URL and form action. This is not a restrictive script-source CSP.
- Worker response headers for content type, framing, permissions and referrer policy.
- Public enquiry handler fails closed unless Cloudflare's rate-limit binding and ingress IP are present. Private-preview mode is explicitly separate. Rate limits are not a global DDoS guarantee.
- Input validation, honeypot, request-size limits, fixed recipient, timeout and idempotency. Mocked enquiry/security tests passed; no live email delivery was tested.

GitHub Pages cannot execute this Worker or apply its response headers. Complete a separate deployment and production configuration before claiming these backend controls are active. External CDN libraries remain supply-chain dependencies; bundling and broader CSP testing are future improvements.

## Activation checklist

Finish GitHub TLS and enforce HTTPS. Validate Cloudflare Full (strict) before proxying. Verify DDoS protection and user flows. Consider domain ownership verification in GitHub and review repository access/MFA. Preserve mail records and verify Zoho DKIM placement before changing DMARC policy. Recommendations are not claims that these settings were changed.

## Reporting

Contact hello@72-bpm.com with affected URLs and reproduction steps. Do not put credentials or customer data in public issues.
