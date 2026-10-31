// Centralised API base URL
// In development: reads from .env (VITE_API_URL=http://localhost:5000)
// In production build: reads from .env.production (VITE_API_URL=https://your-render-url.onrender.com)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default API_URL;
