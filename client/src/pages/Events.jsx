import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, CheckCircle, ExternalLink } from 'lucide-react';
import API_URL from '../api';

const EVENTS_FALLBACK = [
  {
    id: 'ev-1',
    title: 'HackTech 2026 Hackathon',
    category: 'Coding & AI',
    date: '2026-11-15',
    venue: 'Computing Hub A',
    description: '36-hour flagship hackathon building intelligent cloud apps and cybersecurity defenses.',
    seatsAvailable: 45,
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'ev-2',
    title: 'CyberShield CTF Competition',
    category: 'Cybersecurity',
    date: '2026-11-16',
    venue: 'Cyber Range Lab',
    description: 'Hands-on capture the flag covering OWASP vulnerabilities, SQL/NoSQL injection, and cryptography.',
    seatsAvailable: 30,
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'ev-3',
    title: 'Cloud DevOps & CI/CD Sprint',
    category: 'Cloud Engineering',
    date: '2026-11-17',
    venue: 'Seminar Hall 2',
    description: 'Automating multi-cloud deployment with GitHub Actions, Render, and Netlify pipelines.',
    seatsAvailable: 60,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'ev-4',
    title: 'RoboQuest Autonomous Rover Race',
    category: 'Robotics',
    date: '2026-11-18',
    venue: 'Central Arena',
    description: 'Autonomous micro-rover obstacle navigation using computer vision and edge computing.',
    seatsAvailable: 20,
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80'
  }
];

const Events = () => {
  const [events, setEvents] = useState(EVENTS_FALLBACK);
  const [registered, setRegistered] = useState({});

  useEffect(() => {
    // Attempt to fetch live events from API
    fetch(`${API_URL}/api/events`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setEvents(data.data);
        }
      })
      .catch(() => {
        // Fallback already initialized
      });
  }, []);

  const handleRegister = (id) => {
    setRegistered((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 800 }}>TechFest 2026 Official Events</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          Register for symposium competitions, hackathons, and technology masterclasses.
        </p>
      </div>

      <div className="grid-cards">
        {events.map((ev) => (
          <div className="card" key={ev.id}>
            <img
              src={ev.image}
              alt={ev.title}
              className="card-img"
              loading="lazy"
              width="600"
              height="200"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#818cf8', letterSpacing: '0.05em' }}>
                {ev.category}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Users size={14} /> {ev.seatsAvailable} seats
              </span>
            </div>

            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{ev.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem', flexGrow: 1 }}>
              {ev.description}
            </p>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Calendar size={14} /> {ev.date}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <MapPin size={14} /> {ev.venue}
                </span>
              </div>

              {registered[ev.id] ? (
                <button className="btn btn-secondary" style={{ width: '100%', borderColor: '#10b981', color: '#10b981' }} disabled>
                  <CheckCircle size={16} /> Registered
                </button>
              ) : (
                <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => handleRegister(ev.id)}>
                  Register Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
