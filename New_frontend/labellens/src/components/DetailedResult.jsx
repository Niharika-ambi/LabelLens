import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FilterBar from './FilterBar';
import EmojiRating from './EmojiRating';
import { calcPercentage, getRating } from '../utils/scoreHelper';

export default function DetailedResult({ data, onBack }) {
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  const percentage = calcPercentage(data.ingredients);
  const rating = getRating(percentage);

  const goodCount = data.ingredients.filter(i => i.status === 'good').length;
  const badCount = data.ingredients.filter(i => i.status === 'bad').length;

  const filtered = data.ingredients.filter(i => {
    if (filter === 'all') return true;
    return i.status === filter;
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.35 }}
      style={{ width: '100%', maxWidth: '620px', margin: '0 auto' }}
    >
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--text-secondary)',
          background: 'none',
          border: 'none',
          fontFamily: 'var(--font-display)',
          fontSize: '13px',
          cursor: 'pointer',
          marginBottom: '1.5rem',
          padding: '4px 0',
        }}
      >
        ← Back to Summary
      </button>

      {/* Header card */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.8rem',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
        flexWrap: 'wrap',
      }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>
            Ingredient Analysis
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {data.productName}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
            {data.ingredients.length} ingredients analysed
          </div>
        </div>
        <EmojiRating percentage={percentage} />
      </div>

      {/* Score bar */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '1.2rem 1.5rem',
        marginBottom: '16px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'var(--font-display)' }}>Safety Score</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: rating.color }}>{percentage}%</span>
        </div>
        <div style={{
          height: '8px',
          background: 'var(--border)',
          borderRadius: '4px',
          overflow: 'hidden',
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            style={{
              height: '100%',
              background: `linear-gradient(90deg, ${rating.color}88, ${rating.color})`,
              borderRadius: '4px',
              boxShadow: `0 0 12px ${rating.glow}`,
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
          <span style={{ fontSize: '11px', color: 'var(--accent)' }}>✓ {goodCount} safe</span>
          <span style={{ fontSize: '11px', color: 'var(--red)' }}>✗ {badCount} harmful</span>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ marginBottom: '14px' }}>
        <FilterBar
          active={filter}
          onChange={setFilter}
          counts={{ good: goodCount, bad: badCount }}
        />
      </div>

      {/* Ingredient list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <AnimatePresence mode="popLayout">
          {filtered.map((item, i) => (
            <IngredientRow
              key={item.id}
              item={item}
              index={i}
              expanded={expanded === item.id}
              onToggle={() => setExpanded(expanded === item.id ? null : item.id)}
            />
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontSize: '14px' }}>
            No ingredients in this category
          </div>
        )}
      </div>
    </motion.div>
  );
}

function IngredientRow({ item, index, expanded, onToggle }) {
  const isGood = item.status === 'good';
  const isBad = item.status === 'bad';

  const color = isGood ? 'var(--accent)' : isBad ? 'var(--red)' : 'var(--yellow)';
  const bgColor = isGood ? 'var(--accent-dim)' : isBad ? 'var(--red-dim)' : 'var(--yellow-dim)';
  const borderColor = isGood ? 'rgba(168,255,62,0.2)' : isBad ? 'rgba(255,78,78,0.2)' : 'rgba(255,209,102,0.2)';
  const icon = isGood ? '✓' : isBad ? '✗' : '~';
  const label = isGood ? 'Safe' : isBad ? 'Harmful' : 'Moderate';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      onClick={onToggle}
      style={{
        background: expanded ? 'var(--bg-card-hover)' : 'var(--bg-card)',
        border: `1px solid ${expanded ? borderColor : 'var(--border)'}`,
        borderRadius: 'var(--radius-md)',
        padding: '14px 16px',
        cursor: 'pointer',
        transition: 'background 0.2s, border-color 0.2s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Status icon */}
        <div style={{
          width: 30,
          height: 30,
          borderRadius: '8px',
          background: bgColor,
          border: `1px solid ${borderColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color,
          fontWeight: 700,
          fontSize: '14px',
          flexShrink: 0,
        }}>
          {icon}
        </div>

        {/* Name */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: '14px',
            color: 'var(--text-primary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: expanded ? 'normal' : 'nowrap',
          }}>
            {item.name}
          </div>
        </div>

        {/* Badge */}
        <div style={{
          background: bgColor,
          color,
          border: `1px solid ${borderColor}`,
          borderRadius: '6px',
          padding: '2px 10px',
          fontSize: '11px',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          flexShrink: 0,
        }}>
          {label}
        </div>

        {/* Expand arrow */}
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          style={{ color: 'var(--text-muted)', fontSize: '12px', flexShrink: 0 }}
        >
          ▼
        </motion.span>
      </div>

      {/* Expanded reason */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: `1px solid var(--border)`,
              fontSize: '13px',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              paddingLeft: '42px',
            }}>
              {item.reason}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
