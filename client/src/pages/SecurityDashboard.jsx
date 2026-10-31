import React from 'react';
import { ShieldCheck, GitBranch, Cloud, CheckCircle, Terminal, Cpu } from 'lucide-react';

const OWASP_MATRIX = [
  {
    risk: 'A03: Injection (NoSQL Injection)',
    impact: 'Attackers inject query selectors (e.g. { $ne: null }) to bypass password authentication.',
    mitigation: 'express-mongo-sanitize middleware strips all keys containing $ or ., and schema enforces strict string typing.',
    status: 'Protected'
  },
  {
    risk: 'A03: Cross-Site Scripting (XSS)',
    impact: 'Malicious scripts injected via input fields execute in victim browsers to steal credentials.',
    mitigation: 'React escapes text nodes by default; express-validator .escape() cleanses inputs; Helmet CSP blocks untrusted inline scripts.',
    status: 'Protected'
  },
  {
    risk: 'Cross-Site Request Forgery (CSRF)',
    impact: 'Unauthorized malicious commands transmitted from a trusted user session.',
    mitigation: 'JWT cookies configured with SameSite=lax/none and HttpOnly flags preventing unauthorized third-party submission.',
    status: 'Protected'
  },
  {
    risk: 'A02: Cryptographic Failures',
    impact: 'Interception of passwords and tokens in transit or plain-text database compromises.',
    mitigation: 'Passwords salted and hashed using bcryptjs (cost factor 10); HTTPS TLS encryption enforced on all cloud tiers.',
    status: 'Protected'
  },
  {
    risk: 'A05: Security Misconfiguration',
    impact: 'Default headers leaking server stack versions, allowing clickjacking and MIME-type sniffing.',
    mitigation: 'Helmet middleware sets Content-Security-Policy, X-Frame-Options: SAMEORIGIN, and X-Content-Type-Options: nosniff.',
    status: 'Protected'
  }
];

const SecurityDashboard = () => {
  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 800 }}>System Architecture & Security Platform</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', maxWidth: '720px', margin: '0.5rem auto 0' }}>
          Real-time overview of cloud infrastructure, automated CI/CD pipeline verification, and defense-in-depth security matrix.
        </p>
      </div>

      {/* CI/CD Status Summary */}
      <div className="card" style={{ marginBottom: '2.5rem', background: 'rgba(30, 41, 59, 0.7)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GitBranch color="#818cf8" size={22} />
            GitHub Actions CI/CD Pipeline (Step 11)
          </h3>
          <span className="badge-secure">
            <CheckCircle size={14} /> Pipeline Status: All Checks Passing (Green)
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Stage 1</div>
            <div style={{ fontWeight: 700, margin: '0.25rem 0' }}>Checkout & Setup</div>
            <div style={{ color: '#10b981', fontSize: '0.85rem' }}>Node.js v22.x Environment</div>
          </div>

          <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Stage 2</div>
            <div style={{ fontWeight: 700, margin: '0.25rem 0' }}>Dependency Install</div>
            <div style={{ color: '#10b981', fontSize: '0.85rem' }}>npm ci (Clean reproducible)</div>
          </div>

          <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Stage 3</div>
            <div style={{ fontWeight: 700, margin: '0.25rem 0' }}>Automated Testing</div>
            <div style={{ color: '#10b981', fontSize: '0.85rem' }}>Jest & Supertest (7/7 Passed)</div>
          </div>

          <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Stage 4</div>
            <div style={{ fontWeight: 700, margin: '0.25rem 0' }}>Production Build</div>
            <div style={{ color: '#10b981', fontSize: '0.85rem' }}>Vite Minified & Tree-shaken</div>
          </div>
        </div>
      </div>

      {/* OWASP Matrix */}
      <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ShieldCheck color="#10b981" size={22} />
        OWASP Top 10 Prevention Matrix (Step 1 to 5)
      </h3>

      <div style={{ overflowX: 'auto' }}>
        <table className="audit-table">
          <thead>
            <tr>
              <th>Vulnerability Category</th>
              <th>Attack Vector / Threat</th>
              <th>Implemented Preventive Measure</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {OWASP_MATRIX.map((row, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: 600, color: '#f8fafc' }}>{row.risk}</td>
                <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{row.impact}</td>
                <td style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>{row.mitigation}</td>
                <td>
                  <span style={{ color: '#34d399', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={14} /> {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cloud Platforms Map */}
      <div className="card" style={{ marginTop: '2.5rem' }}>
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cloud color="#38bdf8" size={22} />
          Multi-Cloud Deployment Topology (Step 12 to 15)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
          <div style={{ padding: '1.25rem', background: '#0f172a', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <h4 style={{ color: '#38bdf8' }}>Frontend (Client Tier)</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.5rem 0' }}>
              Platform: <strong>Netlify / Vercel</strong><br />
              Protocol: HTTPS with Auto-SSL<br />
              Routing: SPA Rewrites via <code>_redirects</code>
            </p>
          </div>

          <div style={{ padding: '1.25rem', background: '#0f172a', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <h4 style={{ color: '#818cf8' }}>Backend (Application Tier)</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.5rem 0' }}>
              Platform: <strong>Render Web Service</strong><br />
              Environment: Node.js + Express<br />
              Config: Environment variables for Secrets
            </p>
          </div>

          <div style={{ padding: '1.25rem', background: '#0f172a', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <h4 style={{ color: '#10b981' }}>Database (Data Tier)</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.5rem 0' }}>
              Platform: <strong>MongoDB Atlas Cluster</strong><br />
              Security: SCRAM Authentication + TLS<br />
              Access: Network IP Whitelist
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityDashboard;
