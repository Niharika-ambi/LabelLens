/**
 * Returns rating info based on safety percentage
 * 90–100 → Star (excellent)
 * 75–89  → Happy (good)
 * 40–74  → Moderate (okay)
 * 0–39   → Fear (bad)
 */
export function getRating(percentage) {
  if (percentage >= 90) {
    return {
      emoji: '⭐',
      label: 'Excellent',
      sublabel: 'Remarkably clean product',
      color: '#a8ff3e',
      glow: 'rgba(168,255,62,0.3)',
      tier: 'star',
    };
  } else if (percentage >= 75) {
    return {
      emoji: '😊',
      label: 'Good',
      sublabel: 'Mostly safe ingredients',
      color: '#a8ff3e',
      glow: 'rgba(168,255,62,0.2)',
      tier: 'happy',
    };
  } else if (percentage >= 40) {
    return {
      emoji: '😐',
      label: 'Moderate',
      sublabel: 'Some questionable ingredients',
      color: '#ffd166',
      glow: 'rgba(255,209,102,0.2)',
      tier: 'moderate',
    };
  } else {
    return {
      emoji: '😨',
      label: 'Concerning',
      sublabel: 'High amount of harmful ingredients',
      color: '#ff4e4e',
      glow: 'rgba(255,78,78,0.3)',
      tier: 'fear',
    };
  }
}

/**
 * Calculates safety percentage from ingredient list
 */
export function calcPercentage(ingredients) {
  if (!ingredients || ingredients.length === 0) return 0;
  const good = ingredients.filter(i => i.status === 'good').length;
  return Math.round((good / ingredients.length) * 100);
}
