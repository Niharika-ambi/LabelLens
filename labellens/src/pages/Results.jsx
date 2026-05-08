import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ResultCard from '../components/ResultCard';
import DetailedResult from '../components/DetailedResult';
import { MOCK_RESULT } from '../utils/mockData';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const [view, setView] = useState('simple'); // 'simple' | 'detailed'

  const result = location.state?.result ?? MOCK_RESULT;

  return (
    <div style={{
      flex: 1,
      paddingTop: '64px',
      minHeight: '100vh',
      position: 'relative',
    }}>
      {/* Background */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `
          linear-gradient(var(--border) 1px, transparent 1px),
          linear-gradient(90deg, var(--border) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
        opacity: 0.25,
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: '2rem 1.5rem 4rem',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Top bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-secondary)',
              background: 'none',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '8px 14px',
              fontFamily: 'var(--font-display)',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            ← Scan Another
          </button>

          {/* View toggle — only show when in simple view */}
          {view === 'simple' && (
            <div style={{
              display: 'flex',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '4px',
              gap: '4px',
            }}>
              {['simple', 'detailed'].map(v => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  style={{
                    padding: '7px 18px',
                    borderRadius: '8px',
                    background: view === v ? 'var(--accent)' : 'transparent',
                    color: view === v ? '#0a0d12' : 'var(--text-secondary)',
                    border: 'none',
                    fontFamily: 'var(--font-display)',
                    fontWeight: view === v ? 700 : 400,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textTransform: 'capitalize',
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {view === 'simple' ? (
            <motion.div
              key="simple"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <ResultCard
                data={result}
                onViewDetailed={() => setView('detailed')}
              />
            </motion.div>
          ) : (
            <motion.div
              key="detailed"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DetailedResult
                data={result}
                onBack={() => setView('simple')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
