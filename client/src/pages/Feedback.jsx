import React, { useState, useEffect } from 'react';
import { MessageSquare, ShieldAlert, ShieldCheck, AlertTriangle, Send, RefreshCw, Terminal } from 'lucide-react';

const INITIAL_FEEDBACKS = [
  {
    _id: '1',
    author: 'Sayooj S.',
    event: 'HackTech 2026',
    rating: 5,
    comment: 'Great organization and smooth participant onboarding!',
    createdAt: '2026-10-31T10:00:00Z'
  },
  {
    _id: '2',
    author: 'Security Auditor',
    event: 'CyberShield CTF',
    rating: 5,
    comment: 'Verified Helmet headers and express-mongo-sanitize middleware.',
    createdAt: '2026-10-31T11:30:00Z'
  }
];

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState(INITIAL_FEEDBACKS);
  const [author, setAuthor] = useState('');
  const [event, setEvent] = useState('HackTech 2026');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isVulnerableMode, setIsVulnerableMode] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);
  const [xssTriggeredNotice, setXssTriggeredNotice] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/feedback')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          setFeedbacks(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!author.trim() || !comment.trim()) {
      setStatusMsg({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    const newFeedback = {
      _id: 'local-' + Date.now(),
      author,
      event,
      rating: Number(rating),
      comment,
      createdAt: new Date().toISOString()
    };

    // If vulnerable mode is active and payload contains script/onerror
    if (isVulnerableMode && (comment.includes('<script>') || comment.includes('onerror='))) {
      setXssTriggeredNotice(true);
      try {
        if (comment.includes("alert(")) {
          const match = comment.match(/alert\((['"])(.*?)\1\)/);
          const msg = match ? match[2] : 'hi';
          alert(`[Simulated XSS Pop-up]: ${msg}`);
        } else {
          alert("[Simulated XSS Pop-up]: hi");
        }
      } catch (err) {}
    } else {
      setXssTriggeredNotice(false);
    }

    setFeedbacks([newFeedback, ...feedbacks]);
    setComment('');
    setAuthor('');
    setStatusMsg({
      type: 'success',
      text: isVulnerableMode
        ? 'Feedback rendered unsafely (Demonstrated XSS Vulnerability)!'
        : 'Feedback submitted safely! Stored/rendered as safe plain text.'
    });

    // Also attempt POST to backend API
    fetch('http://localhost:5000/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newFeedback)
    }).catch(() => {});
  };

  const loadXssPayload = () => {
    setAuthor('Attacker');
    setComment("<script>alert('hi')</script>");
  };

  const loadImgXssPayload = () => {
    setAuthor('Security Tester');
    setComment("<img src=x onerror=alert('hi')>");
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Feedback & OWASP XSS Demonstration Lab</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', maxWidth: '720px', margin: '0.5rem auto 0' }}>
          Lab Step 4: Demonstrate Cross-Site Scripting (XSS) with <code>&lt;script&gt;alert('hi')&lt;/script&gt;</code>,
          then verify the fix with safe plain-text rendering and Content-Security-Policy (CSP) headers.
        </p>
      </div>

      {/* Mode Switcher Banner */}
      <div style={{
        background: isVulnerableMode ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
        border: `1px solid ${isVulnerableMode ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
        borderRadius: '12px',
        padding: '1.25rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isVulnerableMode ? <ShieldAlert size={28} color="#ef4444" /> : <ShieldCheck size={28} color="#10b981" />}
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: isVulnerableMode ? '#f87171' : '#34d399' }}>
              Current Mode: {isVulnerableMode ? 'UNSECURED (Vulnerable to XSS)' : 'SECURED (Production Plain-Text Escaping & CSP)'}
            </div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              {isVulnerableMode
                ? 'Input is injected directly into DOM via simulated unescaped markup. Scripts execute.'
                : 'Input is safely escaped. React renders user text as text nodes; Helmet blocks unauthorized scripts.'}
            </div>
          </div>
        </div>

        <button
          className="btn"
          style={{
            background: isVulnerableMode ? '#10b981' : '#ef4444',
            color: '#fff',
            fontSize: '0.85rem',
            padding: '0.5rem 1rem'
          }}
          onClick={() => {
            setIsVulnerableMode(!isVulnerableMode);
            setXssTriggeredNotice(false);
          }}
        >
          <RefreshCw size={14} /> Switch to {isVulnerableMode ? 'Secured Mode (Fix)' : 'Vulnerable Mode (Demonstrate)'}
        </button>
      </div>

      {xssTriggeredNotice && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.15)',
          border: '1px solid #f59e0b',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1.5rem',
          color: '#fbbf24',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <AlertTriangle size={20} />
          <span><strong>XSS Alert Triggered!</strong> In vulnerable mode, typing <code>&lt;script&gt;alert('hi')&lt;/script&gt;</code> causes the browser to execute injected JavaScript.</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
        {/* Feedback Submission Form */}
        <div className="card">
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Send size={18} color="#6366f1" /> Submit Event Feedback
          </h3>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', alignSelf: 'center' }}>Preset Payloads:</span>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
              onClick={loadXssPayload}
            >
              Payload 1: &lt;script&gt;alert('hi')&lt;/script&gt;
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
              onClick={loadImgXssPayload}
            >
              Payload 2: &lt;img onerror&gt;
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Your Name</label>
              <input
                type="text"
                className="form-control"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Sayooj S."
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Event</label>
              <select className="form-control" value={event} onChange={(e) => setEvent(e.target.value)}>
                <option value="HackTech 2026">HackTech 2026</option>
                <option value="CyberShield CTF">CyberShield CTF</option>
                <option value="Cloud DevOps Sprint">Cloud DevOps Sprint</option>
                <option value="RoboQuest">RoboQuest</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Rating (1 to 5)</label>
              <select className="form-control" value={rating} onChange={(e) => setRating(e.target.value)}>
                <option value="5">⭐⭐⭐⭐⭐ 5 - Excellent</option>
                <option value="4">⭐⭐⭐⭐ 4 - Very Good</option>
                <option value="3">⭐⭐⭐ 3 - Good</option>
                <option value="2">⭐⭐ 2 - Average</option>
                <option value="1">⭐ 1 - Poor</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Feedback Comment</label>
              <textarea
                className="form-control"
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Type your feedback here or test an XSS payload..."
                required
              />
            </div>

            {statusMsg && (
              <div style={{
                padding: '0.6rem 0.8rem',
                borderRadius: '6px',
                marginBottom: '1rem',
                fontSize: '0.85rem',
                background: statusMsg.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                color: statusMsg.type === 'error' ? '#f87171' : '#34d399'
              }}>
                {statusMsg.text}
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Submit Feedback
            </button>
          </form>
        </div>

        {/* Display / Verification List */}
        <div>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} color="#06b6d4" /> Recent Participant Feedbacks
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {feedbacks.map((fb) => (
              <div key={fb._id} className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{fb.author}</span>
                  <span style={{ color: '#f59e0b', fontSize: '0.85rem' }}>{'★'.repeat(fb.rating)}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#818cf8', marginBottom: '0.6rem' }}>
                  {fb.event} • {new Date(fb.createdAt).toLocaleTimeString()}
                </div>

                <div style={{
                  background: 'rgba(0, 0, 0, 0.25)',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  fontSize: '0.9rem',
                  fontFamily: fb.comment.includes('<') ? 'Courier New, monospace' : 'inherit'
                }}>
                  {isVulnerableMode ? (
                    // Vulnerable demonstration rendering
                    <div dangerouslySetInnerHTML={{ __html: fb.comment }} />
                  ) : (
                    // Secured production plain text rendering
                    <div>{fb.comment}</div>
                  )}
                </div>

                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Rendering method: {isVulnerableMode ? (
                    <span style={{ color: '#f87171' }}>dangerouslySetInnerHTML (Vulnerable)</span>
                  ) : (
                    <span style={{ color: '#34d399' }}>React Safe JSX Text Node (Secured)</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
