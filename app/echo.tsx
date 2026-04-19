// echo.tsx — Quickmatch (ghost race) mode
// Same scoring as daily.tsx:
//   Base 100pts. Fast answer (<2s from buttons unlocking): +50 → 150 base.
//   Streak multiplier: 3→2x, 5→3x, 7→4x. Wrong resets streak.
//   Every 3 consecutive wrong: −50pts, miss streak resets.
// 1-second UI lock per question.
// All mutable game values live in refs (stale-closure-safe).

import { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { QUESTIONS, shuffleQuestions, getRank } from './questions';
import { Avatar } from '@/components/Avatar';
import { useAppStore } from './store';

const GHOST_NAMES  = ['QuizWizard_88', 'GhostPlayer_42', 'BrainFuel_77', 'TriviaTank_99', 'SmartBomb_11'];
const GHOST_COLORS = ['#6B9DFF', '#FF6B9D', '#6BDB6B', '#FFB86B', '#B86BFF'];
const GHOST_EMOTES = [
  '"feeling confident today 😏"',
  '"just here to flex 💪"',
  '"I studied for this 📚"',
  '"good luck... you\'ll need it 😈"',
  '"rematch? 🔥"',
];
const GHOST_TIMES = ['played 47 min ago', 'played 2 hours ago', 'played yesterday', 'played 3 hours ago'];

function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const FREE_LIMIT     = 7;
const LOCK_MS        = 1000;
const SPEED_MS       = 2000;
const BASE_PTS       = 100;
const SPEED_BONUS    = 50;
const MISS_PENALTY   = 50;
const MISS_THRESHOLD = 3;

function getMultiplier(streak: number): number {
  if (streak >= 7) return 4;
  if (streak >= 5) return 3;
  if (streak >= 3) return 2;
  return 1;
}

export default function EchoScreen() {
  const router = useRouter();
  const { updateHighScore, freePlay, recordPlay } = useAppStore();
  const [phase, setPhase] = useState<'matching' | 'preview' | 'playing' | 'result'>('matching');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const playsToday = freePlay.date === today ? freePlay.playsToday : 0;
    const oneMoreTaps = freePlay.date === today ? freePlay.oneMoreTaps : 0;
    const isGated = playsToday >= FREE_LIMIT + oneMoreTaps * 3;
    if (isGated) {
      router.replace('/');
    } else {
      recordPlay();
    }
  }, []);

  const [questions] = useState(() => shuffleQuestions(QUESTIONS));
  const [ghost] = useState({
    name:  pick(GHOST_NAMES),
    color: pick(GHOST_COLORS),
    emote: pick(GHOST_EMOTES),
    time:  pick(GHOST_TIMES),
  });

  // ── Refs: source of truth for all mutable game values ──────────────────────
  const scoreRef         = useRef(0);
  const streakRef        = useRef(0);
  const missRef          = useRef(0);
  const questionStartRef = useRef(0);
  const canAnswerRef     = useRef(false);

  // ── State: display + render triggers ──────────────────────────────────────
  const [questionIndex,  setQuestionIndex]  = useState(0);
  const [timeLeft,       setTimeLeft]       = useState(60);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [ghostScore,     setGhostScore]     = useState(0);
  const [displayScore,   setDisplayScore]   = useState(0);
  const [displayStreak,  setDisplayStreak]  = useState(0);
  const [displayMiss,    setDisplayMiss]    = useState(0);
  const [lastPoints,     setLastPoints]     = useState<number | null>(null);
  const [lastLabel,      setLastLabel]      = useState('');
  const [locked,         setLocked]         = useState(true);

  const timerRef     = useRef<ReturnType<typeof setInterval> | null>(null);
  const nextRef      = useRef<ReturnType<typeof setTimeout>  | null>(null);
  const lockTimerRef = useRef<ReturnType<typeof setTimeout>  | null>(null);

  const question   = questions[questionIndex];
  const isAnswered = selectedAnswer !== null;

  // Matching → preview after 1.5s
  useEffect(() => {
    if (phase !== 'matching') return;
    const t = setTimeout(() => setPhase('preview'), 1500);
    return () => clearTimeout(t);
  }, [phase]);

  // ── 60-second countdown ────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'playing') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          finishGame();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current)     clearInterval(timerRef.current);
      if (nextRef.current)      clearTimeout(nextRef.current);
      if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    };
  }, [phase]);

  // ── 1-second UI lock per question ──────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'playing') return;
    canAnswerRef.current = false;
    setLocked(true);
    lockTimerRef.current = setTimeout(() => {
      questionStartRef.current = Date.now(); // speed clock starts when buttons open
      canAnswerRef.current = true;
      setLocked(false);
    }, LOCK_MS);
    return () => {
      if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    };
  }, [questionIndex, phase]);

  // ── Answer handler ─────────────────────────────────────────────────────────
  function handleAnswer(index: number) {
    if (isAnswered || !canAnswerRef.current) return;
    canAnswerRef.current = false;

    const elapsed = Date.now() - questionStartRef.current;
    setSelectedAnswer(index);

    const isCorrect = index === question.correct;
    let delta = 0;
    let label = '';

    if (isCorrect) {
      streakRef.current += 1;
      missRef.current    = 0;

      const fast = elapsed < SPEED_MS;
      const base = fast ? BASE_PTS + SPEED_BONUS : BASE_PTS;
      const mult = getMultiplier(streakRef.current);
      delta = base * mult;

      if (fast)     label += '⚡ fast';
      if (mult > 1) label += (label ? ' · ' : '') + `${mult}× streak`;
    } else {
      streakRef.current = 0;
      missRef.current  += 1;
      if (missRef.current >= MISS_THRESHOLD) {
        delta = -MISS_PENALTY;
        missRef.current = 0;
        label = '3 misses';
      }
    }

    scoreRef.current = Math.max(0, scoreRef.current + delta);

    setDisplayScore(scoreRef.current);
    setDisplayStreak(streakRef.current);
    setDisplayMiss(missRef.current);
    setLastPoints(delta !== 0 ? delta : null);
    setLastLabel(label);

    nextRef.current = setTimeout(() => {
      const next = questionIndex + 1;
      if (next >= questions.length) {
        finishGame();
      } else {
        setSelectedAnswer(null);
        setLastPoints(null);
        setLastLabel('');
        setQuestionIndex(next);
      }
    }, isCorrect ? 800 : 1500);
  }

  function finishGame() {
    if (timerRef.current)  clearInterval(timerRef.current);
    if (nextRef.current)   clearTimeout(nextRef.current);
    const final = scoreRef.current;
    const base  = Math.max(final, 300);
    const swing = Math.floor(base * 0.35 * (Math.random() - 0.4));
    setGhostScore(Math.max(0, base + swing));
    updateHighScore('arcade', final);
    setPhase('result');
  }

  const multiplier = getMultiplier(displayStreak);
  const flashBg = isAnswered
    ? (selectedAnswer === question?.correct ? '#bbf7d0' : '#fecaca')
    : '#fff';

  function getButtonStyle(index: number) {
    if (!isAnswered) return styles.answerButton;
    if (index === question.correct) return [styles.answerButton, styles.correct];
    if (index === selectedAnswer)   return [styles.answerButton, styles.wrong];
    return [styles.answerButton, styles.dim];
  }

  // ── Matching ────────────────────────────────────────────────────────────────
  if (phase === 'matching') {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#dc2626" />
        <Text style={styles.matchingText}>Finding your ghost...</Text>
      </View>
    );
  }

  // ── Preview ─────────────────────────────────────────────────────────────────
  if (phase === 'preview') {
    return (
      <View style={styles.centered}>
        <Text style={styles.vsLabel}>YOUR OPPONENT</Text>
        <Avatar color={ghost.color} eyes="square" mouth="smirk" size={110} />
        <Text style={styles.ghostName}>{ghost.name}</Text>
        <Text style={styles.ghostTime}>{ghost.time}</Text>
        <Text style={styles.ghostEmote}>{ghost.emote}</Text>
        <TouchableOpacity style={styles.startButton} onPress={() => setPhase('playing')}>
          <Text style={styles.startButtonText}>START RACE</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Result ──────────────────────────────────────────────────────────────────
  if (phase === 'result') {
    const final = scoreRef.current;
    const won   = final > ghostScore;
    const tied  = final === ghostScore;
    const headline = tied ? "IT'S A TIE" : won ? '🏆 YOU WIN' : '👻 GHOST WINS';
    return (
      <View style={styles.centered}>
        <Text style={styles.resultTitle}>{headline}</Text>
        <View style={styles.scoreReveal}>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreCardLabel}>You</Text>
            <Text style={[styles.scoreValue, won && styles.winnerScore]}>{final}</Text>
            <Text style={styles.scoreRank}>{getRank(final)}</Text>
          </View>
          <Text style={styles.vsText}>VS</Text>
          <View style={styles.scoreCard}>
            <Avatar color={ghost.color} eyes="square" mouth="smirk" size={40} />
            <Text style={styles.scoreCardLabel}>{ghost.name}</Text>
            <Text style={[styles.scoreValue, !won && !tied && styles.winnerScore]}>{ghostScore}</Text>
            <Text style={styles.scoreRank}>{getRank(ghostScore)}</Text>
          </View>
        </View>

        <Text style={styles.emotePrompt}>How did that feel?</Text>
        <View style={styles.emoteRow}>
          {['"nailed it 🎯"', '"lucky shot 🎲"', '"next time 💪"', '"no comment 😑"'].map(e => (
            <TouchableOpacity key={e} style={styles.emoteChip} onPress={() => router.replace('/')}>
              <Text style={styles.emoteText}>{e}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.startButton} onPress={() => router.replace('/echo')}>
          <Text style={styles.startButtonText}>NEW GHOST</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Playing ─────────────────────────────────────────────────────────────────
  return (
    <View style={[styles.container, { backgroundColor: flashBg }]}>

      {/* Debug overlay — remove before ship */}
      <View style={styles.debugBar}>
        <Text style={styles.debugTxt}>streak:{displayStreak} miss:{displayMiss} mult:{multiplier}× pts:{displayScore}</Text>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.timerText}>⏱ {timeLeft}s</Text>
        <View style={styles.ghostMini}>
          <Avatar color={ghost.color} eyes="square" mouth="smirk" size={30} />
          <Text style={styles.ghostMiniName}>{ghost.name}</Text>
        </View>
        <View style={styles.scoreWrap}>
          {multiplier > 1 && <Text style={styles.multBadge}>{multiplier}×</Text>}
          <Text style={styles.scoreText}>{displayScore.toLocaleString()}</Text>
        </View>
      </View>

      {/* Status strips */}
      {displayStreak >= 3 && (
        <Text style={styles.streakLabel}>🔥 {displayStreak} streak</Text>
      )}
      {displayMiss >= 2 && (
        <Text style={styles.missLabel}>⚠️ {displayMiss}/3 misses</Text>
      )}

      {/* Question */}
      <Text style={styles.question}>{question.question}</Text>

      {/* Points flash */}
      {isAnswered && lastPoints !== null && (
        <View style={styles.flashWrap}>
          <Text style={[styles.pointsFlash, lastPoints < 0 && styles.pointsNeg]}>
            {lastPoints > 0 ? `+${lastPoints}` : `${lastPoints}`}
          </Text>
          {lastLabel ? <Text style={styles.bonusLabel}>{lastLabel}</Text> : null}
        </View>
      )}

      {/* Answer buttons */}
      <View style={styles.answers}>
        {question.options.map((option, i) => (
          <TouchableOpacity
            key={i}
            style={[getButtonStyle(i), (locked && !isAnswered) && styles.lockedBtn]}
            onPress={() => handleAnswer(i)}
            disabled={isAnswered || locked}
          >
            <Text style={styles.answerText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, padding: 24, paddingTop: 60 },
  centered:     { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  matchingText: { fontSize: 18, color: '#6b7280', marginTop: 16 },
  vsLabel:      { fontSize: 13, fontWeight: '700', color: '#9ca3af', letterSpacing: 2 },
  ghostName:    { fontSize: 26, fontWeight: '800', color: '#111827', marginTop: 8 },
  ghostTime:    { fontSize: 14, color: '#9ca3af' },
  ghostEmote:   { fontSize: 16, color: '#6b7280', fontStyle: 'italic', marginBottom: 16 },
  startButton:  { backgroundColor: '#dc2626', paddingVertical: 16, paddingHorizontal: 48, borderRadius: 14, marginTop: 8 },
  startButtonText: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 1 },

  debugBar:  { backgroundColor: '#1A1522', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginBottom: 8 },
  debugTxt:  { fontFamily: 'monospace', fontSize: 11, color: '#7BEFFC' },

  header:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  timerText:    { fontSize: 20, fontWeight: '800', color: '#111827' },
  ghostMini:    { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ghostMiniName:{ fontSize: 13, color: '#6b7280', fontWeight: '600' },
  scoreWrap:    { flexDirection: 'row', alignItems: 'center', gap: 6 },
  multBadge:    { backgroundColor: '#FFD23F', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, fontSize: 13, fontWeight: '900', color: '#1A1522' },
  scoreText:    { fontSize: 20, fontWeight: '800', color: '#111827' },
  streakLabel:  { fontSize: 14, fontWeight: '700', color: '#f97316', marginBottom: 4 },
  missLabel:    { fontSize: 12, fontWeight: '700', color: '#dc2626', marginBottom: 4 },
  question:     { fontSize: 26, fontWeight: '600', color: '#111827', marginBottom: 24, lineHeight: 34 },
  flashWrap:    { alignItems: 'center', marginBottom: 8 },
  pointsFlash:  { fontSize: 22, fontWeight: '900', color: '#16a34a', textAlign: 'center' },
  pointsNeg:    { color: '#dc2626' },
  bonusLabel:   { fontSize: 11, fontWeight: '700', color: '#16a34a', letterSpacing: 0.5, textTransform: 'uppercase', marginTop: 3 },
  answers:      { gap: 12 },
  answerButton: { backgroundColor: '#f3f4f6', padding: 18, borderRadius: 12 },
  lockedBtn:    { opacity: 0.55 },
  correct:      { backgroundColor: '#16a34a' },
  wrong:        { backgroundColor: '#dc2626' },
  dim:          { opacity: 0.5 },
  answerText:   { fontSize: 18, fontWeight: '500', color: '#111827', textAlign: 'center' },

  resultTitle:  { fontSize: 32, fontWeight: '900', color: '#111827' },
  scoreReveal:  { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: '#f9fafb', borderRadius: 16, padding: 20, marginVertical: 16 },
  scoreCard:    { alignItems: 'center', gap: 4, flex: 1 },
  vsText:       { fontSize: 18, fontWeight: '800', color: '#9ca3af' },
  scoreCardLabel:{ fontSize: 13, fontWeight: '600', color: '#6b7280' },
  scoreValue:   { fontSize: 36, fontWeight: '900', color: '#111827' },
  winnerScore:  { color: '#dc2626' },
  scoreRank:    { fontSize: 12, color: '#9ca3af' },
  emotePrompt:  { fontSize: 16, color: '#374151', fontWeight: '600' },
  emoteRow:     { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' },
  emoteChip:    { backgroundColor: '#f3f4f6', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 20 },
  emoteText:    { fontSize: 13, color: '#374151' },
});
