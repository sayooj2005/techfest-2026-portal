import React from 'react';
import { Shield, GitBranch, CheckCircle2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f8fafc', fontWeight: 600 }}>
            <Shield size={18} color="#10b981" />
            TechFest 2026 Production Deployment Portal
          </div>
          <p style={{ marginTop: '6px', fontSize: '0.825rem' }}>
            Built for Web Technology Laboratory (23CSB40B) — Secure MERN Architecture.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.85rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <CheckCircle2 size={15} color="#10b981" /> Helmet CSP Active
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <CheckCircle2 size={15} color="#10b981" /> NoSQL Sanitized
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <GitBranch size={15} color="#6366f1" /> GitHub Actions CI Green
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
