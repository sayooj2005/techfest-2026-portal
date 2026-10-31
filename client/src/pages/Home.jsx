import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Lock, Terminal, Cpu, Sparkles, Award, Users, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <section className="hero">
        <div className="hero-pill">
          <Sparkles size={16} /> National Technical Symposium • Edition 2026
        </div>
        <h1 className="hero-title">
          TechFest 2026 <span>Innovation Portal</span>
        </h1>
        <p className="hero-subtitle">
          The premier technical symposium uniting 5,000+ developers, builders, and innovators.
          Compete in high-stakes hackathons, capture-the-flag cyber ranges, robotics championships, and cutting-edge tech masterclasses.
        </p>

        <div className="hero-cta">
          <Link to="/events" className="btn btn-primary">
            Explore Events <ArrowRight size={16} />
          </Link>
          <Link to="/gallery" className="btn btn-secondary">
            View Gallery
          </Link>
          <Link to="/feedback" className="btn btn-secondary">
            Community Feedback
          </Link>
        </div>
      </section>

      {/* Highlights Grid */}
      <div className="grid-cards">
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <Lock color="#6366f1" size={24} />
            <h3 style={{ fontSize: '1.2rem' }}>Enterprise Security</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Built with defense-in-depth architecture, hardened against injection vulnerabilities, session tampering, and malicious payloads with strict cryptographic controls.
          </p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <Zap color="#06b6d4" size={24} />
            <h3 style={{ fontSize: '1.2rem' }}>Ultra-Fast Edge Delivery</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Engineered with modern code-splitting, progressive media loading, and global CDN caching to deliver sub-second response times across every device.
          </p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <Award color="#10b981" size={24} />
            <h3 style={{ fontSize: '1.2rem' }}>Continuous Integration</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Automated production release pipeline running end-to-end integration tests and performance audits on every single deployment.
          </p>
        </div>
      </div>

      {/* Cloud Architecture Showcase */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu color="#a855f7" size={22} />
          Full-Stack Cloud Architecture
        </h3>
        <div className="terminal-box">
          <code>
            [Frontend Edge: Vercel CDN • React 19 • Global SSL]<br />
            &nbsp;&nbsp;&nbsp;&nbsp;│<br />
            &nbsp;&nbsp;&nbsp;&nbsp;▼ (Encrypted HTTPS REST API • Secure Session Cookies)<br />
            [Backend Cluster: Render Cloud Service • Express API Server]<br />
            &nbsp;&nbsp;&nbsp;&nbsp;│<br />
            &nbsp;&nbsp;&nbsp;&nbsp;▼ (TLS 1.3 Wire Protocol • SCRAM Authentication)<br />
            [Data Layer: MongoDB Atlas Cloud Cluster]
          </code>
        </div>
      </div>
    </div>
  );
};

export default Home;
