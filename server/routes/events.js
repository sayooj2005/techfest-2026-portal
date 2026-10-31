const express = require('express');
const router = express.Router();

const TECHFEST_EVENTS = [
  {
    id: 'ev-1',
    title: 'HackTech 2026 Hackathon',
    category: 'Coding & AI',
    date: '2026-11-15',
    venue: 'Computing Hub A',
    description: '36-hour flagship hackathon building intelligent cloud apps.',
    seatsAvailable: 45,
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'ev-2',
    title: 'CyberShield CTF Competition',
    category: 'Cybersecurity',
    date: '2026-11-16',
    venue: 'Cyber Range Lab',
    description: 'Hands-on capture the flag covering OWASP vulnerabilities and cryptography.',
    seatsAvailable: 30,
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'ev-3',
    title: 'Cloud DevOps & CI/CD Sprint',
    category: 'Cloud Engineering',
    date: '2026-11-17',
    venue: 'Seminar Hall 2',
    description: 'Automating multi-cloud deployment with GitHub Actions and Docker.',
    seatsAvailable: 60,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'ev-4',
    title: 'RoboQuest Autonomous Rover Race',
    category: 'Robotics',
    date: '2026-11-18',
    venue: 'Central Arena',
    description: 'Autonomous micro-rover navigation through obstacles.',
    seatsAvailable: 20,
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80'
  }
];

// @route   GET /api/events
router.get('/', (req, res) => {
  res.json({ success: true, count: TECHFEST_EVENTS.length, data: TECHFEST_EVENTS });
});

module.exports = router;
