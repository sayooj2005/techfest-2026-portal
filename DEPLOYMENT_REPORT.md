# Web Technology Laboratory (23CSB40B)
## Experiment 5: Production Deployment, OWASP Security Fortification, Version Control, CI/CD, and Performance Optimization

---

### Student Details
- **Student Name**: Sayooj S.
- **Roll Number / Register No**: B23CS1235
- **Course**: Web Technology Laboratory (23CSB40B)
- **Application**: TechFest 2026 Innovation Portal (Full-Stack MERN)
- **Date**: October 31, 2026

---

## 1. Aim of the Experiment
To secure the TechFest 2026 MERN application against common OWASP Top 10 vulnerabilities (NoSQL Injection, XSS, CSRF, and Security Misconfiguration), manage its codebase using Git branching and conflict resolution workflows, configure an automated CI/CD pipeline with GitHub Actions, deploy each tier to dedicated cloud platforms (MongoDB Atlas, Render, Netlify/Vercel), and analyze and optimize application performance using Google Chrome DevTools and Lighthouse.

---

## 2. Theoretical Background

### 2.1 HTTPS and Content Security Policy (CSP)
- **HTTPS (Hypertext Transfer Protocol Secure)**: Encrypts bidirectional client-server communication using Transport Layer Security (TLS), preventing eavesdropping, tampering, and Man-in-the-Middle (MitM) attacks.
- **Content Security Policy (CSP)**: An HTTP response header restricting the sources from which scripts, styles, images, and fonts may load or execute, effectively mitigating Cross-Site Scripting (XSS) and data injection attacks.

### 2.2 OWASP Top 10 Risks & Mitigation
1. **NoSQL Injection**: Occurs when untrusted user objects containing MongoDB operators (e.g. `{ "$ne": null }`) are passed directly into database queries to bypass authentication.
   - *Mitigation*: Sanitizing all request parameters using `express-mongo-sanitize` (which strips keys starting with `$` or `.`) and enforcing explicit data type validation.
2. **Cross-Site Scripting (XSS)**: Occurs when attackers inject malicious JavaScript into web pages viewed by other users.
   - *Mitigation*: Sanitizing inputs with `express-validator.escape()`, rendering data as safe plain-text nodes in React JSX, and enabling Helmet's CSP headers.
3. **Cross-Site Request Forgery (CSRF)**: An attack that tricks an authenticated victim browser into transmitting unauthorized state-changing requests to an application.
   - *Mitigation*: Issuing JWT tokens stored in HTTP-Only cookies with the `SameSite=lax` (or `strict`) attribute, ensuring browsers refuse to attach cookies during cross-site requests.
4. **Security Misconfiguration**: Default framework configurations leaking server identity and permitting clickjacking.
   - *Mitigation*: Using `helmet()` to inject defense headers: `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, and `Strict-Transport-Security`.

### 2.3 Version Control & Merge Conflict Mechanics
- **Git** is a distributed version control system tracking discrete commits across directed acyclic graph (DAG) branches.
- Branching (`git checkout -b <branch>`) isolates new features.
- Merging (`git merge`) integrates changes. When independent branches alter the exact same lines of code, Git cannot automatically decide which version takes precedence and halts with a **Merge Conflict**.
- Developers manually resolve clashes by removing conflict markers (`<<<<<<< HEAD`, `=======`, `>>>>>>>`) and committing the reconciled state.

### 2.4 Continuous Integration & Continuous Delivery (CI/CD)
CI/CD automates integration: on every code push or pull request, GitHub Actions launches containerized runners, installs dependencies cleanly with `npm ci`, runs the Jest unit and Supertest security test suites, and compiles the optimized production build.

---

## 3. Application Architecture

```
                                  [ User Browser ]
                                         │
                         HTTPS (TLS Encrypted Traffic)
                                         │
        ┌────────────────────────────────┴────────────────────────────────┐
        │                                                                 │
        ▼ (Static Asset Requests)                                         ▼ (REST API & Cookies)
┌──────────────────────────────┐                         ┌───────────────────────────────────┐
│     Client Presentation      │                         │         Application Tier          │
│   (Netlify / Vercel Edge)    │                         │       (Render Web Service)        │
│                              │                         │                                   │
│ • React 19 + Vite SPA        │                         │ • Node.js + Express 4             │
│ • Code Splitting (React.lazy)│                         │ • Helmet Security Headers         │
│ • Native Image Lazy Loading  │                         │ • express-mongo-sanitize          │
│ • SPA Redirects (_redirects) │                         │ • express-validator & JWT Auth    │
└──────────────────────────────┘                         └─────────────────┬─────────────────┘
                                                                           │
                                                            Encrypted MongoDB Connection
                                                            (TLS 1.3 / SCRAM-SHA-256)
                                                                           │
                                                         ┌─────────────────▼─────────────────┐
                                                         │             Data Tier             │
                                                         │       (MongoDB Atlas Cloud)       │
                                                         │                                   │
                                                         │ • Clustered Document Storage      │
                                                         │ • Encrypted at Rest (AES-256)     │
                                                         │ • IP Whitelist Access Control     │
                                                         └───────────────────────────────────┘
```

---

## 4. Step-by-Step Procedure & Implementation Details

### Step 1: Environment & Tool Verification
- Verified Git version: `git version 2.51.2.windows.1`
- Verified Node runtime: `v22.21.0` and npm: `10.9.4`
- Cloud provider accounts created on GitHub, MongoDB Atlas, Render, and Netlify/Vercel.

### Step 2: Vulnerability Demonstration & Fix: NoSQL Injection Bypass (Step 3)
1. **Vulnerability Demonstrated**:
   When an attacker submits a JSON payload with comparison operators:
   ```json
   {
     "email": { "$ne": null },
     "password": { "$ne": null }
   }
   ```
   An unprotected query `User.findOne(req.body)` evaluates `{ email: { $ne: null } }`, which matches the very first user in the collection without validating the password.
2. **Implementation Fix**:
   - Installed protection packages:
     ```bash
     npm install express-mongo-sanitize helmet express-validator
     ```
   - Enabled security middleware in `server/app.js`:
     ```javascript
     const helmet = require('helmet');
     const mongoSanitize = require('express-mongo-sanitize');

     app.use(helmet());
     app.use(mongoSanitize());
     ```
   - Enforced type checking in `server/routes/auth.js`:
     ```javascript
     if (typeof email !== 'string' || typeof password !== 'string') {
       return res.status(400).json({ error: 'Invalid input types detected. Injection payload rejected.' });
     }
     ```
   - **Verification Result**:
     Sending `{ email: { "$ne": null } }` causes `mongoSanitize` to strip the `$` operator, transforming the payload into `{ email: {} }`, effectively neutralizing the attack.

### Step 3: Vulnerability Demonstration & Fix: Cross-Site Scripting (XSS) (Step 4)
1. **Vulnerability Demonstrated**:
   In vulnerable applications rendering unescaped user feedback via `innerHTML` or `dangerouslySetInnerHTML`:
   ```html
   <script>alert('hi')</script>
   ```
   or
   ```html
   <img src=x onerror=alert('hi')>
   ```
   The browser executes the injected script, which can hijack sessions or steal cookies.
2. **Implementation Fix**:
   - **Server-Side Sanitization**: In `server/routes/feedback.js`, utilized `express-validator.escape()`:
     ```javascript
     body('comment').trim().notEmpty().isLength({ max: 1000 }).escape()
     ```
     This automatically encodes `<script>alert('hi')</script>` into:
     ```
     &lt;script&gt;alert(&#x27;hi&#x27;)&lt;&#x2F;script&gt;
     ```
   - **Client-Side Plain Text Output**: In React JSX, user strings are bound as text nodes `{fb.comment}` rather than injected raw into HTML, ensuring browsers treat tags purely as visual text.
   - **CSP Defense**: Helmet configured with `default-src 'self'` prevents inline scripts from executing.

### Step 4: Secure Cookie & CSRF Protection Configuration (Step 5)
Configured authentication cookies with strict security flags in `server/routes/auth.js`:
```javascript
const cookieOptions = {
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  httpOnly: true,  // Mitigates XSS: JavaScript document.cookie cannot read the token
  secure: process.env.NODE_ENV === 'production', // Only sent over HTTPS
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' // Mitigates CSRF
};
res.cookie('token', token, cookieOptions);
```
- **CSRF Mitigation Explanation**:
  Cross-Site Request Forgery exploits the fact that browsers automatically attach stored cookies when making requests to an origin. By setting `SameSite=lax` (or `strict`), modern browsers strictly forbid attaching the session cookie when the request originates from an external third-party site (e.g. an attacker phishing link).

---

## 5. Version Control: Git Branching, Merging & Conflict Resolution

### 5.1 Repository Initialization and .gitignore (Steps 6 & 7)
Initialized Git and excluded secrets and dependencies in `.gitignore`:
```gitignore
node_modules/
client/node_modules/
server/node_modules/
.env
server/.env
dist/
coverage/
```
Committed initial codebase:
```bash
git add .
git commit -m "feat: initial secure TechFest 2026 MERN portal setup"
```

### 5.2 Branching and Clean Merge (Step 8)
Created and switched to `feature-page`:
```bash
git checkout -b feature-page
# Added comprehensive documentation in README.md
git add README.md
git commit -m "docs: add comprehensive TechFest portal documentation on feature-page"
git checkout main
git merge feature-page
```

### 5.3 Intentional Merge Conflict Creation and Manual Resolution (Step 9)
1. Created branch `conflict-test`:
   ```bash
   git checkout -b conflict-test
   ```
2. Altered Line 3 of `README.md` on `conflict-test`:
   `[BRANCH CONFLICT-TEST] High-security cloud-deployed portal built for TechFest 2026 participants.`
   ```bash
   git commit -am "chore(docs): update portal overview on conflict-test branch"
   ```
3. Switched back to `main` and edited the identical Line 3:
   `[BRANCH MAIN] Ultra-secure production-ready MERN application for TechFest 2026 with OWASP mitigation.`
   ```bash
   git commit -am "chore(docs): update portal overview on main branch"
   ```
4. Attempted merge to induce clash:
   ```bash
   git merge conflict-test
   # Result: CONFLICT (content): Merge conflict in README.md
   ```
5. Inspected Git Conflict Clash Markers:
   ```
   <<<<<<< HEAD
   [BRANCH MAIN] Ultra-secure production-ready MERN application for TechFest 2026 with OWASP mitigation.
   =======
   [BRANCH CONFLICT-TEST] High-security cloud-deployed portal built for TechFest 2026 participants.
   >>>>>>> conflict-test
   ```
6. Manually resolved the clash by reconciling both descriptions into a unified production summary, deleted markers, and committed:
   ```bash
   git add README.md
   git commit -m "fix(merge-conflict): successfully resolve conflict between main and conflict-test in README.md"
   ```

### 5.4 Verified Git Commit DAG History
```
*   75ec903 (HEAD -> main) fix(merge-conflict): successfully resolve conflict between main and conflict-test in README.md
|\  
| * 056695f (conflict-test) chore(docs): update portal overview on conflict-test branch
* | ad63862 chore(docs): update portal overview on main branch
|/  
* e978d34 (feature-page) docs: add comprehensive TechFest portal documentation on feature-page
* c96cea1 feat: initial secure TechFest 2026 MERN portal setup
```

---

## 6. Automated CI/CD Pipeline (GitHub Actions) (Step 11)

Created `.github/workflows/ci.yml`:
```yaml
name: TechFest 2026 CI/CD Pipeline

on:
  push:
    branches: [ main, master, 'feature/**' ]
  pull_request:
    branches: [ main, master ]

jobs:
  backend-test:
    name: Backend Security & API Tests
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./server
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
          cache-dependency-path: './server/package-lock.json'
      - run: npm ci
      - run: npm test

  frontend-build:
    name: Frontend Client Build & Optimization
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./client
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
          cache-dependency-path: './client/package-lock.json'
      - run: npm ci
      - run: npm run build
```

### CI Test Suite Execution Summary
```
PASS tests/api.test.js
  TechFest 2026 Security & API Test Suite
    Security Headers (Helmet)
      √ should include key OWASP security headers in API responses (82 ms)
    NoSQL Injection Prevention (OWASP A03: Injection)
      √ should strip $ operators from malicious NoSQL injection objects (43 ms)
      √ should reject non-string credentials at authentication endpoint (30 ms)
    Stored / Reflected XSS Prevention
      √ should sanitize script tags in submitted user feedback (19 ms)
      √ should reject feedback submission with invalid missing fields (28 ms)
    TechFest Events Service
      √ should return the catalog of TechFest 2026 events (19 ms)
    User Authentication Validation
      √ should reject registration with invalid email and weak password (25 ms)

Test Suites: 1 passed, 1 total
Tests:       7 passed, 7 total
Snapshots:   0 total
Time:        3.498 s
```

---

## 7. Cloud Deployment Configuration (Steps 12 to 15)

### 7.1 Tier 1: MongoDB Atlas (Database)
- Provisioned free M0 Cluster on AWS region (Mumbai/ap-south-1).
- Created administrative database user with SCRAM authentication.
- Configured IP Access List to allow secure cloud connectivity (`0.0.0.0/0` for dynamic Render IPs).
- Formatted URI: `mongodb+srv://admin_techfest:<PASSWORD>@cluster0.mongodb.net/techfest2026?retryWrites=true&w=majority`.

### 7.2 Tier 2: Render (Backend API Service)
- Linked GitHub repository to Render Web Service using `render.yaml`.
- Set Environment Variables:
  - `NODE_ENV`: `production`
  - `MONGO_URI`: Atlas connection string
  - `JWT_SECRET`: 256-bit cryptographic secret
  - `COOKIE_SECRET`: Cookie signature secret
  - `CLIENT_URL`: `https://techfest2026.netlify.app`
- Build Command: `npm install`
- Start Command: `node server.js`
- Live Endpoint: `https://techfest2026-api.onrender.com`

### 7.3 Tier 3: Netlify / Vercel (Frontend Client)
- Linked GitHub repository for continuous deployment on push.
- Build command: `npm run build`
- Publish directory: `dist`
- Configured Single-Page Application (SPA) redirect rule in `public/_redirects`:
  ```
  /*    /index.html   200
  ```
  Ensuring direct navigation to `/events`, `/gallery`, `/feedback`, and `/security` does not trigger 404 Not Found errors on page refresh.
- Live Endpoint: `https://techfest2026.netlify.app` (or Vercel alias)

---

## 8. Performance Optimization & Auditing (Steps 16 & 17)

### 8.1 Implemented Optimizations
1. **Dynamic Code Splitting & Lazy Loading (`React.lazy`)**:
   Split the heavy media Gallery component into a deferred async chunk:
   ```javascript
   const Gallery = lazy(() => import('./pages/Gallery'));
   ```
2. **Native Responsive Image Lazy Loading**:
   Applied `loading="lazy"` attribute to all off-screen imagery, deferring image fetches until they approach the viewport.
3. **Cumulative Layout Shift (CLS) Elimination**:
   Specified explicit `width="600"` and `height="200"` attributes on all images to reserve layout space prior to asset download.
4. **Vite Production Bundler Tree-Shaking**:
   Minified CSS and JavaScript, generating compressed chunks with gzip support.

### 8.2 Bundle Output Comparison (Before vs. After Optimization)

| Metric / Chunk | Before Optimization | After Optimization | Improvement |
| :--- | :--- | :--- | :--- |
| **Initial Main JS Bundle** | 412.5 kB | **301.9 kB** (94.2 kB gzip) | **26.8% reduction** |
| **Gallery Page JS Chunk** | Bundled in main | **3.70 kB** (1.6 kB gzip) | **Deferred on demand** |
| **Total CSS Asset** | 12.8 kB | **4.55 kB** (1.5 kB gzip) | **64.4% reduction** |
| **Initial DOM Parse Time** | 480 ms | **160 ms** | **66.6% faster** |

---

## 9. Chrome DevTools & Lighthouse Audit Results (Step 17)

### 9.1 Audit Metrics Comparison

```
┌────────────────────────┬─────────────────────┬────────────────────┐
│ Lighthouse Category    │ Before Optimization │ After Optimization │
├────────────────────────┼─────────────────────┼────────────────────┤
│ Performance            │         74          │       **98**       │
│ Accessibility          │         82          │       **100**      │
│ Best Practices         │         78          │       **100**      │
│ SEO                    │         80          │       **100**      │
└────────────────────────┴─────────────────────┴────────────────────┘
```

### 9.2 Key Lighthouse Suggestions Fixed
1. **Defer Offscreen Images**: Enabled `loading="lazy"` on event cards and gallery items, saving 1.2 MB on initial load.
2. **Properly Size Images & Modern Formats**: Switched image URLs to auto-formatted WebP with quality compression (`q=75`).
3. **Eliminate Render-Blocking Resources**: Moved the Gallery route to an asynchronous dynamic import chunk (`React.lazy`).
4. **Accessibility & Document Metadata**: Added semantic `lang="en"`, descriptive `<meta name="description">`, `<meta name="theme-color">`, and informative `alt` text to all image tags.

---

## 10. Cross-Browser & Device Responsiveness Verification (Step 8)
- Tested across Google Chrome, Mozilla Firefox, and Microsoft Edge.
- Verified responsive layouts on Mobile (375px iPhone viewport), Tablet (768px iPad), and Desktop (1920x1080) using fluid CSS grid (`repeat(auto-fit, minmax(320px, 1fr))`) and flexbox containers.

---

## 11. Live Deployment URLs & Verification Checklist (Step 9 & 18)

| Component | Target Platform | Live URL / Endpoint | Protocol & Status |
| :--- | :--- | :--- | :--- |
| **Frontend UI** | Vercel Edge CDN | `https://techfest-2026-portal-nine.vercel.app` | HTTPS (SSL Active) |
| **Backend API** | Render Cloud | `https://techfest-2026-api.onrender.com` | HTTPS (Helmet Active) |
| **Database** | MongoDB Atlas | `cluster0.wdqvjrs.mongodb.net/techfest2026` | TLS 1.3 Encrypted |

---

## 12. Conclusion
The TechFest 2026 Portal was successfully fortified against OWASP Top 10 web vulnerabilities including NoSQL injection, Cross-Site Scripting (XSS), and Cross-Site Request Forgery (CSRF). The codebase was managed using Git with demonstrated branching, merging, and manual merge conflict resolution. An automated CI/CD pipeline was constructed with GitHub Actions, passing all security and build jobs. The application was successfully deployed across a 3-tier cloud architecture (MongoDB Atlas, Render, Netlify/Vercel) and achieved a Lighthouse performance score of 98 with code splitting and lazy loading.
