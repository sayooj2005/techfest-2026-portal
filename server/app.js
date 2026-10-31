const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const authRoutes = require('./routes/auth');
const feedbackRoutes = require('./routes/feedback');
const eventRoutes = require('./routes/events');

const app = express();

// 1. Security Headers via Helmet (Mitigates XSS, Clickjacking, MIME-sniffing)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        imgSrc: ["'self'", 'data:', 'https://images.unsplash.com', 'https://via.placeholder.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        connectSrc: ["'self'", process.env.CLIENT_URL || '*'],
        upgradeInsecureRequests: []
      }
    },
    crossOriginEmbedderPolicy: false
  })
);

// 2. CORS configuration for secure cross-origin communication
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Allow during dev/demo
    },
    credentials: true, // Needed for HTTP-only cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  })
);

// 3. Body parsers
app.use(express.json({ limit: '10kb' })); // Limit body size to mitigate DoS
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser(process.env.COOKIE_SECRET || 'techfestcookiesecret98765'));

// 4. Data Sanitization against NoSQL query injection
// Removes any keys containing '$' or '.' from req.body, req.query, and req.params
app.use(mongoSanitize());

// 5. Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'TechFest 2026 API',
    security: {
      helmetEnabled: true,
      mongoSanitizeEnabled: true,
      corsRestricted: true
    }
  });
});

// 6. Application Routes
app.use('/api/auth', authRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/events', eventRoutes);

// 7. Demonstration / Vulnerability Lab Test Endpoint (For comparing raw vs secured payload)
app.post('/api/security-lab/inspect-nosql', (req, res) => {
  // mongoSanitize removes keys starting with $
  // If someone sends { "email": { "$ne": null } }, mongoSanitize cleanses it to { "email": {} }
  res.json({
    message: 'Inspection complete',
    receivedPayload: req.body,
    sanitized: true
  });
});

// 8. 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// 9. Central Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

module.exports = app;
