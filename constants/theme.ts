// Super Smart 2026 — Design System
// Cream Stadium palette: 2012 DNA reinterpreted for 2026

export const Colors = {
  // Core palette
  cream:   '#FFF4DF',   // background
  ink:     '#1A1522',   // primary text, borders, shadows
  pink:    '#FF3D7F',   // brain, Quickmatch card, hero accent
  pinkDark:'#B01A4F',   // brain shadow
  red:     '#E8253C',   // wordmark, active tint, cheeks
  yellow:  '#FFD23F',   // antenna bolt, score accent
  // cyan removed — was the retired Classic card face. Daily Race uses
  // a separate light-cyan token in `dailyrace.bg` below.
  white:   '#FFFFFF',

  // Semantic aliases
  background: '#FFF4DF',
  border:     '#1A1522',
  shadow:     '#1A1522',

  // Mode card faces — v2 palette
  quickmatch: { bg: '#FF3D7F', fg: '#FFF4DF' },  // pink hero
  dailyrace:  { bg: '#7BEFFC', fg: '#1A1522' },   // light cyan

  // Tab bar
  tabActive:   '#E8253C',
  tabInactive: '#9ca3af',
};

// Font family names — matched to what useFonts registers in _layout.tsx
// Super Smart 2026 uses exactly two typefaces (mothership Part 6):
// Archivo Black for display, JetBrains Mono for body/secondary UI.
export const Fonts = {
  black: 'ArchivoBlack',   // Archivo Black 400 — wordmark, card labels, scores, buttons
  mono:  'JetBrainsMono',  // JetBrains Mono 500 — sublabels, stats, footer, mono labels
};

// Spacing / sizing
export const Radius = {
  card: 18,
  sm:   10,
  pill: 999,
};

export const CARD_DEPTH = 7;   // px the card shadow is offset + card presses by
