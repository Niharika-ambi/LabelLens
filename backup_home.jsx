import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import UploadZone from '../components/UploadZone';
import Loader from '../components/Loader';
import { MOCK_RESULT } from '../utils/mockData';

export default function Home() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = (uploadedFile) => {
    setFile(uploadedFile);
  };

  const handleScan = async () => {
    if (!file) return;
    setLoading(true);

    // TODO: Replace with real API call to FastAPI backend
    // const formData = new FormData();
    // formData.append('image', file);
    // const res = await fetch('http://localhost:8000/scan', { method: 'POST', body: formData });
    // const data = await res.json();

    // Using mock data for now
    await new Promise(r => setTimeout(r, 4500));
    navigate('/results', { state: { result: MOCK_RESULT } });
  };

  return (
    <div style={{
      flex: 1,
      paddingTop: '64px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>
      {/* Background grid */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `
          linear-gradient(var(--border) 1px, transparent 1px),
          linear-gradient(90deg, var(--border) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
        opacity: 0.3,
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Glow orb */}
      <div style={{
        position: 'fixed',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '300px',
        background: 'radial-gradient(ellipse, rgba(168,255,62,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem', position: 'relative', zIndex: 1 }}>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ width: '100%', maxWidth: '560px' }}>
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                padding: '1rem',
              }}>
                <Loader />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2.5rem' }}
            >
              {/* Hero text */}
              <div style={{ textAlign: 'center', maxWidth: '540px' }}>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'var(--accent-dim)',
                    border: '1px solid rgba(168,255,62,0.25)',
                    borderRadius: '999px',
                    padding: '5px 14px',
                    marginBottom: '1.2rem',
                  }}
                >
                  <span style={{ fontSize: '10px', color: 'var(--accent)', fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    AI-Powered · Instant · Free
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: 'clamp(2rem, 5vw, 3rem)',
                    letterSpacing: '-0.04em',
                    lineHeight: 1.1,
                    marginBottom: '1rem',
                    color: 'var(--text-primary)',
                  }}
                >
                  Know what's{' '}
                  <span style={{
                    color: 'var(--accent)',
                    textShadow: '0 0 40px rgba(168,255,62,0.4)',
                  }}>
                    really
                  </span>{' '}
                  in your food.
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '1rem',
                    lineHeight: 1.7,
                    maxWidth: '420px',
                    margin: '0 auto',
                  }}
                >
                  Upload a photo of any food packet's ingredient list. Our AI scans, analyses, and tells you exactly what's safe and what isn't.
                </motion.p>
              </div>

              {/* Upload zone */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                style={{ width: '100%' }}
              >
                <UploadZone onUpload={handleUpload} />
              </motion.div>

              {/* Scan button */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.button
                  whileHover={file ? { scale: 1.03, boxShadow: '0 0 40px rgba(168,255,62,0.35)' } : {}}
                  whileTap={file ? { scale: 0.97 } : {}}
                  onClick={handleScan}
                  disabled={!file}
                  style={{
                    padding: '16px 48px',
                    borderRadius: 'var(--radius-md)',
                    background: file ? 'var(--accent)' : 'var(--bg-card)',
                    color: file ? '#0a0d12' : 'var(--text-muted)',
                    border: file ? 'none' : '1px solid var(--border)',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '16px',
                    letterSpacing: '0.02em',
                    cursor: file ? 'pointer' : 'not-allowed',
                    transition: 'all 0.25s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <span>🔍</span>
                  <span>Scan Ingredients</span>
                </motion.button>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{
                  display: 'flex',
                  gap: '24px',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}
              >
                {['🔒 Privacy First', '⚡ 3s Analysis', '🧪 AI Verified'].map(badge => (
                  <span key={badge} style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-display)',
                  }}>
                    {badge}
                  </span>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
