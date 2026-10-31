import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Lock, Terminal, Cpu, CloudCheck } from 'lucide-react';

const Home = () => {
  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <section className="hero">
        <div className="hero-pill">
          <Shield size={16} /> Web Technology Lab — Experiment 5
        </div>
        <h1 className="hero-title">
          TechFest 2026 <span>Secure Portal</span>
        </h1>
        <p className="hero-subtitle">
          Engineered for production resilience against OWASP Top 10 web vulnerabilities,
          automated with GitHub Actions CI, cloud deployed to Atlas, Render & Netlify, and audited with Chrome Lighthouse.
        </p>

        <div className="hero-cta">
          <Link to="/events" className="btn btn-primary">
            Explore 2026 Events
          </Link>
          <Link to="/feedback" className="btn btn-secondary">
            Test XSS & Injection Lab
          </Link>
          <Link to="/security" className="btn btn-secondary">
            View OWASP & CI Architecture
          </Link>
        </div>
      </section>

      {/* Highlights Grid */}
      <div className="grid-cards">
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <Lock color="#6366f1" size={24} />
            <h3 style={{ fontSize: '1.2rem' }}>OWASP Prevention</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Protected with <strong>Helmet CSP</strong> headers, <strong>express-mongo-sanitize</strong> to block NoSQL operator injection, and safe plain-text escaping against stored/reflected XSS.
          </p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <Zap color="#06b6d4" size={24} />
            <h3 style={{ fontSize: '1.2rem' }}>Performance Optimized</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Engineered with React code-splitting (<code>React.lazy</code>), image lazy loading, Vite asset minification, and caching strategies achieving 95+ Lighthouse audits.
          </p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <Terminal color="#10b981" size={24} />
            <h3 style={{ fontSize: '1.2rem' }}>CI/CD Pipeline</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Continuous integration automated with <strong>GitHub Actions</strong>. Runs Jest & Supertest suites, verifies dependency hygiene, and builds production bundles automatically on every push.
          </p>
        </div>
      </div>

      {/* Architecture Overview */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu color="#a855f7" size={22} />
          Three-Tier Secure Cloud Architecture
        </h3>
        <div className="terminal-box">
          <code>
            [Client Tier: Netlify / Vercel (HTTPS, Vite SPA)]<br />
            &nbsp;&nbsp;&nbsp;&nbsp;│<br />
            &nbsp;&nbsp;&nbsp;&nbsp;▼ (HTTPS REST API / SameSite Cookies / Helmet Headers)<br />
            [Application Tier: Render Web Service (Node.js + Express)]<br />
            &nbsp;&nbsp;&nbsp;&nbsp;│<br />
            &nbsp;&nbsp;&nbsp;&nbsp;▼ (Encrypted TLS Connection / IP Whitelist)<br />
            [Data Tier: MongoDB Atlas Cluster (Encrypted at Rest)]
          </code>
        </div>
      </div>
    </div>
  );
};

export default Home;
