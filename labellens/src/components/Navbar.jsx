import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '0 2rem',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(10,13,18,0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: '8px',
          background: 'var(--accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
        }}>
          🔍
        </div>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '1.1rem',
          letterSpacing: '-0.02em',
          color: 'var(--text-primary)',
        }}>
          Label<span style={{ color: 'var(--accent)' }}>Lens</span>
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{
          fontSize: '12px',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-display)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          AI Ingredient Scanner
        </span>
        <div style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: 'var(--accent)',
          boxShadow: '0 0 8px var(--accent)',
          animation: 'pulse 2s ease-in-out infinite',
        }} />
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>
    </motion.nav>
  );
}
