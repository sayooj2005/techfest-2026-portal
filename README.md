# TechFest 2026 — Secure Production MERN Portal

[BRANCH MAIN] Ultra-secure production-ready MERN application for TechFest 2026 with OWASP mitigation. Fortified against the OWASP Top 10 vulnerabilities, integrated with GitHub Actions CI, and configured for multi-cloud deployment.

## Architecture
- **Frontend**: React 19 + Vite (SPA with code splitting & lazy loading)
- **Backend**: Node.js + Express (RESTful API secured with Helmet & express-mongo-sanitize)
- **Database**: MongoDB Atlas Cloud
- **Cloud Hosting**: Render (API) + Netlify/Vercel (Client)
- **CI/CD**: GitHub Actions

## Security Fortifications (OWASP Top 10)
- **Helmet**: Injects Content-Security-Policy (CSP), X-Frame-Options, X-Content-Type-Options: nosniff
- **express-mongo-sanitize**: Strips NoSQL injection operator keys (`$`, `.`)
- **express-validator**: Sanitizes untrusted user feedback against Cross-Site Scripting (XSS)
- **JWT in Secure Cookies**: Configured with `httpOnly: true`, `secure: true`, and `sameSite: 'lax'` to eliminate credential theft and CSRF.
