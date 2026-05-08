import { motion } from 'framer-motion';
import EmojiRating from './EmojiRating';
import { getRating, calcPercentage } from '../utils/scoreHelper';

export default function ResultCard({ data, onViewDetailed }) {
  const percentage = calcPercentage(data.ingredients);
  const rating = getRating(percentage);

  const goodCount = data.ingredients.filter(i => i.status === 'good').length;
  const badCount = data.ingredients.filter(i => i.status === 'bad').length;
  const total = data.ingredients.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: '2.5rem',
        maxWidth: '480px',
        width: '100%',
        margin: '0 auto',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${rating.glow} 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Product name */}
      <div style={{
        fontSize: '12px',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-display)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginBottom: '6px',
      }}>
        Scanned Product
      </div>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: '1.2rem',
        color: 'var(--text-primary)',
        marginBottom: '2rem',
      }}>
        {data.productName}
      </div>

      {/* Emoji + score */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
        <EmojiRating percentage={percentage} large />

        {/* Score circle */}
        <div style={{ flex: 1 }}>
          <ScoreCircle percentage={percentage} color={rating.color} />
        </div>
      </div>

      {/* Quick stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '10px',
        marginBottom: '2rem',
      }}>
        <StatPill label="Total" value={total} color="var(--text-secondary)" />
        <StatPill label="Good" value={goodCount} color="var(--accent)" />
        <StatPill label="Bad" value={badCount} color="var(--red)" />
      </div>

      {/* CTA */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onViewDetailed}
        style={{
          width: '100%',
          padding: '14px',
          background: 'var(--accent)',
          color: '#0a0d12',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '15px',
          letterSpacing: '0.02em',
          cursor: 'pointer',
        }}
      >
        View Detailed Breakdown →
      </motion.button>
    </motion.div>
  );
}

function ScoreCircle({ percentage, color }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="110" height="110">
        <circle cx="55" cy="55" r={radius} fill="none" stroke="var(--border)" strokeWidth="6" />
        <motion.circle
          cx="55" cy="55" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '55px 55px' }}
        />
      </svg>
      <div style={{
        position: 'absolute',
        textAlign: 'center',
      }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: '1.5rem',
          color,
          lineHeight: 1,
        }}>
          {percentage}%
        </div>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>safe score</div>
      </div>
    </div>
  );
}

function StatPill({ label, value, color }) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-sm)',
      padding: '10px 12px',
      textAlign: 'center',
    }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: '1.3rem',
        color,
      }}>{value}</div>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{label}</div>
    </div>
  );
}
