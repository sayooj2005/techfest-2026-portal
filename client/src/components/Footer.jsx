import React from 'react';
import { Shield, GitBranch, CheckCircle2, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f8fafc', fontWeight: 600 }}>
            <Sparkles size={18} color="#6366f1" />
            TechFest 2026 Official Innovation Portal
          </div>
          <p style={{ marginTop: '6px', fontSize: '0.825rem' }}>
            National Technical Symposium & Hackathon Platform. Built on Full-Stack MERN Architecture.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.85rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <CheckCircle2 size={15} color="#10b981" /> Encrypted Cloud
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <CheckCircle2 size={15} color="#10b981" /> Defense-in-Depth
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <GitBranch size={15} color="#6366f1" /> CI/CD Verified
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
