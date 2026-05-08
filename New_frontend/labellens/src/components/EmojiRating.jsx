import { motion } from 'framer-motion';
import { getRating } from '../utils/scoreHelper';

export default function EmojiRating({ percentage, large = false }) {
  const rating = getRating(percentage);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: large ? '1rem' : '0.5rem' }}>
      {/* Emoji bubble */}
      <motion.div
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.2 }}
        style={{
          width: large ? 100 : 64,
          height: large ? 100 : 64,
          borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, ${rating.glow}, var(--bg-card))`,
          border: `2px solid ${rating.color}`,
          boxShadow: `0 0 ${large ? 40 : 20}px ${rating.glow}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: large ? '48px' : '30px',
        }}
      >
        {rating.emoji}
      </motion.div>

      {/* Label */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{ textAlign: 'center' }}
      >
        <div style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: large ? '1.4rem' : '1rem',
          color: rating.color,
          letterSpacing: '-0.02em',
        }}>
          {rating.label}
        </div>
        <div style={{
          fontSize: large ? '14px' : '12px',
          color: 'var(--text-secondary)',
          marginTop: '2px',
        }}>
          {rating.sublabel}
        </div>
      </motion.div>
    </div>
  );
}
