import { motion } from 'framer-motion';

const FILTERS = [
  { value: 'all', label: 'All', emoji: '📋' },
  { value: 'good', label: 'Good', emoji: '✅' },
  { value: 'bad', label: 'Bad', emoji: '⚠️' },
];

export default function FilterBar({ active, onChange, counts }) {
  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
    }}>
      {FILTERS.map(f => {
        const isActive = active === f.value;
        const count = f.value === 'all'
          ? (counts.good + counts.bad)
          : counts[f.value] ?? 0;

        return (
          <motion.button
            key={f.value}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(f.value)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '10px',
              background: isActive
                ? f.value === 'bad' ? 'var(--red-dim)' : 'var(--accent-dim)'
                : 'var(--bg-card)',
              border: isActive
                ? f.value === 'bad' ? '1px solid rgba(255,78,78,0.4)' : '1px solid rgba(168,255,62,0.35)'
                : '1px solid var(--border)',
              color: isActive
                ? f.value === 'bad' ? 'var(--red)' : 'var(--accent)'
                : 'var(--text-secondary)',
              fontFamily: 'var(--font-display)',
              fontWeight: isActive ? 700 : 500,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <span>{f.emoji}</span>
            <span>{f.label}</span>
            <span style={{
              background: isActive
                ? f.value === 'bad' ? 'rgba(255,78,78,0.2)' : 'rgba(168,255,62,0.2)'
                : 'var(--bg-surface)',
              borderRadius: '6px',
              padding: '1px 7px',
              fontSize: '11px',
              fontWeight: 700,
            }}>
              {count}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
