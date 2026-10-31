import React from 'react';
import { Camera, Sparkles } from 'lucide-react';

const GALLERY_ITEMS = [
  {
    id: 1,
    title: 'Hackathon Innovation Hub',
    desc: 'Teams engineering cutting-edge AI and cloud architectures during the 36-hour sprint.',
    url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=75',
    category: 'Hackathon'
  },
  {
    id: 2,
    title: 'Cyber Range CTF Arena',
    desc: 'Participants competing in hands-on penetration testing and digital defense simulations.',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=75',
    category: 'Cybersecurity'
  },
  {
    id: 3,
    title: 'Cloud DevOps Workshop',
    desc: 'Hands-on training in scalable microservices, CI/CD automation, and cloud deployments.',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=75',
    category: 'Cloud'
  },
  {
    id: 4,
    title: 'Autonomous Robotics Expo',
    desc: 'Intelligent micro-rovers and hardware innovations exhibited at the Central Arena.',
    url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=75',
    category: 'Robotics'
  },
  {
    id: 5,
    title: 'Keynote & Project Exposition',
    desc: 'Distinguished industry leaders addressing participants on future technical paradigms.',
    url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=75',
    category: 'Keynote'
  },
  {
    id: 6,
    title: 'Grand Finale & Award Ceremony',
    desc: 'Honoring top innovators, project teams, and national competition champions.',
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=75',
    category: 'Ceremony'
  }
];

const Gallery = () => {
  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="hero-pill">
          <Camera size={14} /> Festival Highlights
        </div>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 800 }}>TechFest 2026 Moments</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', maxWidth: '680px', margin: '0.5rem auto 0' }}>
          Explore highlights from past symposium editions, hackathons, technical exhibitions, and award ceremonies.
        </p>
      </div>

      <div className="grid-cards">
        {GALLERY_ITEMS.map((item) => (
          <div className="card" key={item.id}>
            <img
              src={item.url}
              alt={item.title}
              className="card-img"
              loading="lazy"
              width="600"
              height="200"
              style={{ borderRadius: '8px', objectFit: 'cover' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0.5rem 0' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#06b6d4' }}>
                {item.category}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>TechFest Edition</span>
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{item.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
