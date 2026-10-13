# Zoho Mail enquiry endpoint

GitHub Pages remains the website host; GoDaddy remains DNS. This separate Cloudflare Worker submits enquiry email through the existing Zoho mailbox using authenticated SMTP over TLS on port 465. It requires no mail DNS changes and does not use Resend.

## Deployment

1. Run `npm ci`, `npm test`, and `npx wrangler deploy --dry-run` in this directory.
2. Sign in with `npx wrangler login`, then deploy with `npx wrangler deploy`.
3. In the Worker dashboard, Settings → Variables and Secrets, add three **secrets**: `SMTP_HOST` (the exact outgoing SMTP server shown in Zoho Mail account settings), `SMTP_USER` (the full authenticated mailbox address), and `SMTP_PASSWORD` (a Zoho application-specific password). The sender is `hello@72-bpm.com`; the SMTP account must permit this sender. Enter passwords directly into the dashboard, never into source files or chat.
4. Set the page's `enquiry-endpoint` meta value to the deployed HTTPS Worker URL plus `/api/enquiry` only after server settings are complete.
5. Submit a clearly labelled test enquiry from the website and confirm reception in `hello@72-bpm.com`. A 200 response means Zoho accepted it; it is not proof of inbox delivery.

## Behaviour

The server validates all fields, fixes the recipient, uses the visitor email only as Reply-To, rejects other browser origins, and limits submissions to five per IP per minute. CORS is a browser restriction, not authentication; rate limits provide an additional abuse control. No passwords or submitted content are logged. SMTP cannot guarantee exactly-once delivery: after an uncertain send, this endpoint refuses automatic retransmission for 24 hours and asks the visitor to contact the mailbox with their reference. A Durable Object stores only a submission fingerprint and status for that period. A retry after expiry can send again.

If SMTP credentials, IP identity, or platform bindings are missing, submission fails with a clear message and the visitor can copy the enquiry. No live delivery is claimed until a real test has reached the mailbox.

References: https://www.zoho.com/mail/help/zoho-smtp.html and https://developers.cloudflare.com/workers/runtime-apis/nodejs/tls/
