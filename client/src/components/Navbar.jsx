import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Calendar, Image, MessageSquare, Lock, Activity, Sparkles } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="brand-logo">
          <Sparkles size={24} color="#6366f1" />
          <span>TechFest 2026</span>
        </Link>

        <ul className="nav-links">
          <li>
            <Link to="/" className={isActive('/')}>Home</Link>
          </li>
          <li>
            <Link to="/events" className={isActive('/events')}>
              <Calendar size={16} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />
              Events
            </Link>
          </li>
          <li>
            <Link to="/gallery" className={isActive('/gallery')}>
              <Image size={16} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />
              Gallery
            </Link>
          </li>
          <li>
            <Link to="/feedback" className={isActive('/feedback')}>
              <MessageSquare size={16} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />
              Feedback
            </Link>
          </li>
          <li>
            <Link to="/security" className={isActive('/security')}>
              <ShieldCheck size={16} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />
              Security
            </Link>
          </li>
          <li>
            <Link to="/auth" className="btn btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.875rem' }}>
              <Lock size={14} />
              Portal Login
            </Link>
          </li>
        </ul>

        <div className="badge-secure">
          <span>●</span>
          <span>Verified Secure</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
