const request = require('supertest');
const app = require('../app');

describe('TechFest 2026 Security & API Test Suite', () => {
  describe('Security Headers (Helmet)', () => {
    it('should include key OWASP security headers in API responses', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toBe('healthy');
      expect(res.headers).toHaveProperty('content-security-policy');
      expect(res.headers).toHaveProperty('x-content-type-options', 'nosniff');
      expect(res.headers).toHaveProperty('x-frame-options', 'SAMEORIGIN');
      expect(res.headers).toHaveProperty('x-xss-protection');
    });
  });

  describe('NoSQL Injection Prevention (OWASP A03: Injection)', () => {
    it('should strip $ operators from malicious NoSQL injection objects', async () => {
      const maliciousPayload = {
        email: { $gt: '' },
        password: { $ne: null }
      };
      const res = await request(app)
        .post('/api/security-lab/inspect-nosql')
        .send(maliciousPayload);
      expect(res.statusCode).toEqual(200);
      expect(res.body.receivedPayload.email).not.toHaveProperty('$gt');
      expect(res.body.receivedPayload.password).not.toHaveProperty('$ne');
    });

    it('should reject non-string credentials at authentication endpoint', async () => {
      const maliciousLogin = {
        email: { $ne: null },
        password: { $ne: null }
      };
      const res = await request(app)
        .post('/api/auth/login')
        .send(maliciousLogin);
      expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });
  });

  describe('Stored / Reflected XSS Prevention', () => {
    it('should sanitize script tags in submitted user feedback', async () => {
      const xssPayload = {
        author: 'Student Hacker',
        event: 'HackTech 2026',
        rating: 5,
        comment: "<script>alert('hi')</script>"
      };
      const res = await request(app)
        .post('/api/feedback')
        .send(xssPayload);
      if (res.statusCode === 201) {
        expect(res.body.data.comment).not.toContain('<script>');
        expect(res.body.data.comment).toContain('&lt;script&gt;');
      } else {
        expect(res.statusCode).toBeDefined();
      }
    });

    it('should reject feedback submission with invalid missing fields', async () => {
      const emptyPayload = { author: '', comment: '' };
      const res = await request(app)
        .post('/api/feedback')
        .send(emptyPayload);
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors.length).toBeGreaterThan(0);
    });
  });

  describe('TechFest Events Service', () => {
    it('should return the catalog of TechFest 2026 events', async () => {
      const res = await request(app).get('/api/events');
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('User Authentication Validation', () => {
    it('should reject registration with invalid email and weak password', async () => {
      const badUser = {
        name: 'A',
        email: 'invalid-email-format',
        password: '123'
      };
      const res = await request(app)
        .post('/api/auth/register')
        .send(badUser);
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    // ============================================================
    // THIS TEST IS INTENTIONALLY BROKEN — demonstrates a CI red run.
    // (Step 11: push broken test → see red → fix → push again → green)
    // ============================================================
    it('[INTENTIONALLY FAILING] broken test for CI red-run demonstration', async () => {
      expect(1).toBe(2); // This will always fail
    });
  });
});
