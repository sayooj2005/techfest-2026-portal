import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Star, CheckCircle, Sparkles } from 'lucide-react';
import API_URL from '../api';

const INITIAL_FEEDBACKS = [
  {
    _id: '1',
    author: 'Sayooj S.',
    event: 'HackTech 2026',
    rating: 5,
    comment: 'The hackathon tracks and mentor guidance were world-class! Seamless portal experience.',
    createdAt: '2026-10-31T10:00:00Z'
  },
  {
    _id: '2',
    author: 'Priya Nair',
    event: 'CyberShield CTF',
    rating: 5,
    comment: 'Thrilling capture-the-flag challenges and top-tier infrastructure. Looking forward to next year!',
    createdAt: '2026-10-31T11:30:00Z'
  },
  {
    _id: '3',
    author: 'Aditya Sharma',
    event: 'Cloud DevOps Workshop',
    rating: 5,
    comment: 'Learned so much about multi-cloud architecture and CI/CD pipelines. Extremely well organized.',
    createdAt: '2026-10-31T12:45:00Z'
  }
];

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState(INITIAL_FEEDBACKS);
  const [author, setAuthor] = useState('');
  const [event, setEvent] = useState('HackTech 2026');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [statusMsg, setStatusMsg] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/feedback`)
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

    setFeedbacks([newFeedback, ...feedbacks]);
    setComment('');
    setAuthor('');
    setStatusMsg({
      type: 'success',
      text: 'Thank you! Your feedback has been recorded.'
    });

    // Send to backend API
    fetch(`${API_URL}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newFeedback)
    }).catch(() => {});
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="hero-pill">
          <Sparkles size={14} /> Community Voice
        </div>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Participant Feedback & Reviews</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', maxWidth: '680px', margin: '0.5rem auto 0' }}>
          Hear what attendees, competitors, and workshop participants have to say about TechFest 2026.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
        {/* Feedback Submission Form */}
        <div className="card">
          <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Send size={18} color="#6366f1" /> Share Your Experience
          </h3>

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
              <label className="form-label">Event Participated In</label>
              <select className="form-control" value={event} onChange={(e) => setEvent(e.target.value)}>
                <option value="HackTech 2026">HackTech 2026 Hackathon</option>
                <option value="CyberShield CTF">CyberShield CTF</option>
                <option value="Cloud DevOps Workshop">Cloud DevOps Workshop</option>
                <option value="RoboQuest">RoboQuest Autonomous Rover</option>
                <option value="General">General Fest Experience</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Your Rating</label>
              <select className="form-control" value={rating} onChange={(e) => setRating(e.target.value)}>
                <option value="5">⭐⭐⭐⭐⭐ 5 - Exceptional</option>
                <option value="4">⭐⭐⭐⭐ 4 - Very Good</option>
                <option value="3">⭐⭐⭐ 3 - Good</option>
                <option value="2">⭐⭐ 2 - Average</option>
                <option value="1">⭐ 1 - Needs Improvement</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Review & Comments</label>
              <textarea
                className="form-control"
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts on the event organization, challenges, or venue..."
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

        {/* Display Testimonials List */}
        <div>
          <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} color="#06b6d4" /> Recent Reviews
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {feedbacks.map((fb) => (
              <div key={fb._id} className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{fb.author}</span>
                  <span style={{ color: '#f59e0b', fontSize: '0.85rem' }}>{'★'.repeat(fb.rating)}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#818cf8', marginBottom: '0.6rem' }}>
                  {fb.event} • Verified Participant
                </div>

                <div style={{
                  background: 'rgba(0, 0, 0, 0.2)',
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  fontSize: '0.9rem',
                  color: '#e2e8f0'
                }}>
                  {fb.comment}
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
