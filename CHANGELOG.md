# Change log

Design history is reconstructed from implementation work; revisions were not all separate Git commits. Dates use IST.

## 2026-10-11 — Domain migration and deployment documentation

- Created Cloudflare Free zone; imported existing website and Zoho mail records.
- Replaced Route 53 delegation with joel.ns.cloudflare.com and kay.ns.cloudflare.com in GoDaddy; owner completed SMS verification.
- Replaced old website DNS with four GitHub Pages A records and the www GitHub CNAME; verified public DNS propagation and preserved mail records.
- GitHub custom-domain DNS check succeeded; certificate requested. HTTPS enforcement and Cloudflare proxy activation remain pending.
- Prepared README, complete deployment/rollback guide, exact public DNS snapshot, DNS inventory and security status for project-folder and repository publication.
- Local security hardening and mocked tests completed; this is separate from the currently deployed static release and is not claimed live.

## 2026-10-10 to 2026-10-11 - Implementation revisions
- Created an EV-led landing page with Products, Industrial IoT, Client Ecosystem, Showcase and Contact navigation.
- Added Home navigation, stronger hero composition and a connected EV network preview.
- Adapted the supplied wave logo into a horizontal header and footer lockup: wave beside 72BPM, tagline below the name; colors match the dark theme.
- Aligned the EV CMS control-plane label within its circular hub and added animated network signals.
- Added animated EV charger and vehicle scenes to the CMS product dashboard.
- Replaced the IoT mini-chart with meaningful cell-health and MQTT monitoring information.
- Added an interactive 12-cell UPS battery model with green healthy cells, drag rotation and a simulated cell failure.
- Expanded the UPS case study with manufacturer/end-user alerts, complaint registration, service assignment and purchase vendor management through separate applications.
- Improved the rotating partner scene and selection controls for chargeMOD, Keltron and the OCPI ecosystem.
- Added a validated project enquiry form, category selection, budgets, error feedback and copy fallback.
- Prepared a server-side Resend handler with fixed recipient, validation, honeypot, size limit, burst limiting, timeout and idempotency; sender verification and deployment remain pending.
- Added accessible interaction labels, reduced-motion handling and responsive layouts.

## Verified Git milestones
- a7698105da2b5625dafeeabd6fb5271af995c692 - Initial commit (README), 11 October 2026 IST.
- 81ddf4f8a451a4d6027a56f8154a94c8ba449a6e - Publish 72BPM website for GitHub Pages, 11 October 2026 IST.
- da68884f48309b597a67cfa7af0f263e9ccbb734 - Create CNAME (72-bpm.com), 11 October 2026 IST.
- index.html Git blob: 1eaae4456a44d759410f9ebc3d31daaf6c0f99a7.

## Pending completion

- Finish TLS, enable HTTPS, activate/verify Cloudflare proxy protection and update the recorded status.
- Deploy and verify local hardening and the separately hosted automatic enquiry service.
- Validate unusual existing Zoho TXT placement with the email administrator without altering mail records blindly.
