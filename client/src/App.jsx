import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Events from './pages/Events';
import Feedback from './pages/Feedback';
import Auth from './pages/Auth';
import SecurityDashboard from './pages/SecurityDashboard';

// Step 16: React Code Splitting / Lazy Loading for Performance
// Gallery chunk is deferred and only loaded when navigated to
const Gallery = lazy(() => import('./pages/Gallery'));

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Suspense
            fallback={
              <div style={{ padding: '5rem', textAlign: 'center', color: '#818cf8', fontSize: '1.2rem' }}>
                <div style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⚡</div>
                <div style={{ marginTop: '1rem' }}>Loading Gallery...</div>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/security" element={<SecurityDashboard />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
