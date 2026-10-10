# DNS records — 72-bpm.com

Verified 11 October 2026 (IST) against Cloudflare's public resolver. Exact public TXT values and timestamp are in `dns-records.json`. This is a snapshot of known records, not proof that every historical subdomain was discovered.

## Registrar and delegation

Registrar: GoDaddy. DNS provider: Cloudflare Free.

| Nameserver | Role |
| --- | --- |
| joel.ns.cloudflare.com | Current authoritative nameserver |
| kay.ns.cloudflare.com | Current authoritative nameserver |

## Website and mail records

| Type | Name | Value | Priority | Proxy |
| --- | --- | --- | --- | --- |
| A | @ | 185.199.108.153 | — | DNS only, pending TLS |
| A | @ | 185.199.109.153 | — | DNS only, pending TLS |
| A | @ | 185.199.110.153 | — | DNS only, pending TLS |
| A | @ | 185.199.111.153 | — | DNS only, pending TLS |
| CNAME | www | yadukrishnan117.github.io | — | DNS only, pending TLS |
| MX | @ | mx.zoho.in | 10 | DNS only |
| MX | @ | mx2.zoho.in | 20 | DNS only |
| MX | @ | mx3.zoho.in | 50 | DNS only |
| TXT | @ | Zoho verification, SPF, DKIM-like public key (three records) | — | DNS only |
| TXT | zmail._domainkey | Zoho verification and SPF (two records) | — | DNS only |

Cloudflare TTL is Auto. Mail TXT records were preserved exactly as discovered, not repaired. The DKIM-like key at the root and SPF/verification at zmail._domainkey are unusual; confirm correct selector records in Zoho before making mail-authentication changes. No DMARC record was imported. Do not invent a DKIM selector or enforce a DMARC rejection policy without verification.

## Previous configuration (rollback reference)

Root and www A records pointed to `15.206.29.203`. Prior Route 53 nameservers were `ns-533.awsdns-02.net`, `ns-1228.awsdns-25.org`, `ns-168.awsdns-21.com`, `ns-1884.awsdns-43.co.uk`. Do not restore old delegation unless the old zone and its records are confirmed intact.

## Protection status

Nameservers alone do not enable Cloudflare HTTP DDoS mitigation. Website records are currently DNS only to complete GitHub TLS provisioning. Enable proxying after certificate validation, then verify Cloudflare responses and security settings. Mail records stay DNS only.
