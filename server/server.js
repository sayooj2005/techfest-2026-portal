const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/techfest2026';

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`[Database] Connected to MongoDB at: ${MONGO_URI.split('@')[1] || MONGO_URI}`);
  } catch (err) {
    console.warn(`[Database Warning] Could not connect to MongoDB: ${err.message}`);
    console.warn('[Database Warning] Running in offline demo mode. API routes will respond with validation.');
  }

  app.listen(PORT, () => {
    console.log(`[TechFest 2026] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`[TechFest 2026] Security headers (Helmet) & mongoSanitize: ACTIVE`);
  });
};

startServer();
