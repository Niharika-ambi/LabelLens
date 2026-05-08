import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const STEPS = [
  'Detecting ingredient region...',
  'Extracting text from label...',
  'Identifying ingredients...',
  'Cross-referencing safety database...',
  'Generating health report...',
];

export default function Loader() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex(prev => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        padding: '3rem 1rem',
      }}
    >
      {/* Scanning ring */}
      <div style={{ position: 'relative', width: 120, height: 120 }}>
        {/* Outer ring */}
        <svg width="120" height="120" style={{ position: 'absolute', top: 0, left: 0 }}>
          <circle cx="60" cy="60" r="54" fill="none" stroke="var(--border)" strokeWidth="1.5" />
          <motion.circle
            cx="60" cy="60" r="54"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="339.3"
            animate={{ strokeDashoffset: [339.3, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
          />
        </svg>
        {/* Inner pulsing circle */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'var(--accent-dim)',
            border: '1.5px solid rgba(168,255,62,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
          }}
        >
          🔬
        </motion.div>
      </div>

      {/* Step text */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '1.2rem',
          color: 'var(--text-primary)',
          marginBottom: '8px',
        }}>
          Scanning Ingredients
        </div>

        <motion.div
          key={stepIndex}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontSize: '13px',
            color: 'var(--accent)',
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.04em',
          }}
        >
          {STEPS[stepIndex]}
        </motion.div>
      </div>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {STEPS.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              background: i <= stepIndex ? 'var(--accent)' : 'var(--border-bright)',
              boxShadow: i <= stepIndex ? '0 0 8px var(--accent)' : 'none',
            }}
            style={{
              width: i === stepIndex ? 20 : 7,
              height: 7,
              borderRadius: '4px',
              transition: 'all 0.4s ease',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
