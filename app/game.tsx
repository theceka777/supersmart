// game.tsx — Quickmatch (arcade) mode
// 60-second total timer.
// Scoring:
//   Base: 100pts. Fast answer (<2s from buttons unlocking): +50 → 150 base.
//   Streak multiplier on base: 3→2x, 5→3x, 7→4x. Wrong resets streak.
//   Every 3 consecutive wrong: −50pts, miss streak resets.
// 1-second UI lock per question.
//
// All mutable game values (score, streak, missStreak) live in refs so
// handleAnswer never reads a stale closure value.

import { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { QUESTIONS, shuffleQuestions } from './questions';
import { useAppStore } from './store';

const TOTAL_TIME = 60;
const FREE_LIMIT = 7;
// Invisible double-tap guardrail. 150ms is below human reaction-time floor
// (~200ms), so the button-disable is imperceptible — but it filters out
// rhythmic-tap accidents where a player's finger is mid-motion when the
// next question renders. No visual lock state.
const LOCK_MS = 150;
const SPEED_MS = 2000;
const BASE_PTS = 100;
const SPEED_BONUS = 50;
const MISS_PENALTY = 50;
const MISS_THRESHOLD = 3;

function getMultiplier(streak: number): number {
  if (streak >= 7) return 4;
  if (streak >= 5) return 3;
  if (streak >= 3) return 2;
  return 1;
}

export default function GameScreen() {
  const router = useRouter();
  const { updateHighScore, freePlay, recordPlay } = useAppStore();
  const [questions] = useState(() => shuffleQuestions(QUESTIONS));

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const playsToday = freePlay.date === today ? freePlay.playsToday : 0;
    const oneMoreTaps = freePlay.date === today ? freePlay.oneMoreTaps : 0;
    if (playsToday >= FREE_LIMIT + oneMoreTaps * 3) {
      router.replace('/');
    } else {
      recordPlay();
    }
  }, []);

  // ── Refs: source of truth for all mutable game values ──────────────────────
  // Using refs (not state) so handleAnswer always reads the latest value,
  // regardless of when React last re-rendered the component.
  const scoreRef      = useRef(0);
  const streakRef     = useRef(0);
  const missRef       = useRef(0);
  const questionStartRef = useRef(0);
  const canAnswerRef  = useRef(false);

  // ── State: only used to trigger re-renders for display ─────────────────────
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timeLeft,      setTimeLeft]      = useState(TOTAL_TIME);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  // Display mirrors of refs
  const [displayScore,    setDisplayScore]    = useState(0);
  const [displayStreak,   setDisplayStreak]   = useState(0);
  const [displayMiss,     setDisplayMiss]     = useState(0);
  const [lastPoints,      setLastPoints]      = useState<number | null>(null);
  const [lastLabel,       setLastLabel]       = useState('');

  const timerRef      = useRef<ReturnType<typeof setInterval> | null>(null);
  const advanceRef    = useRef<ReturnType<typeof setTimeout>  | null>(null);
  const lockTimerRef  = useRef<ReturnType<typeof setTimeout>  | null>(null);

  // Current question — always valid while index is in range
  const question   = questions[questionIndex];
  const isAnswered = selectedAnswer !== null;

  // ── Global 60-second countdown ──────────────────────────────────────────────
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, []);

  // Time's up → end
  useEffect(() => {
    if (timeLeft === 0) {
      updateHighScore('quickmatch', scoreRef.current);
      router.replace(`/end?score=${scoreRef.current}&mode=arcade`);
    }
  }, [timeLeft]);

  // ── 150ms invisible double-tap guardrail per question ──────────────────────
  // Speed-bonus timer anchors at question render — the 2-second window
  // encompasses read + decide + tap. No free read buffer.
  useEffect(() => {
    canAnswerRef.current = false;
    questionStartRef.current = Date.now();
    lockTimerRef.current = setTimeout(() => {
      canAnswerRef.current = true;
    }, LOCK_MS);
    return () => {
      if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    };
  }, [questionIndex]);

  // ── Answer handler ──────────────────────────────────────────────────────────
  function handleAnswer(index: number) {
    if (isAnswered || !canAnswerRef.current) return;

    // Immediately block further taps
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

    // Push to display state
    setDisplayScore(scoreRef.current);
    setDisplayStreak(streakRef.current);
    setDisplayMiss(missRef.current);
    setLastPoints(delta !== 0 ? delta : null);
    setLastLabel(label);

    // Unified 1-second post-answer beat — same for right, wrong, or with
    // power-up. Predictable rhythm across the full round.
    const delay = 1000;
    advanceRef.current = setTimeout(() => {
      const next = questionIndex + 1;
      if (next >= questions.length) {
        updateHighScore('quickmatch', scoreRef.current);
        router.replace(`/end?score=${scoreRef.current}&mode=arcade`);
      } else {
        setSelectedAnswer(null);
        setLastPoints(null);
        setLastLabel('');
        setQuestionIndex(next);
      }
    }, delay);
  }

  useEffect(() => () => {
    if (advanceRef.current) clearTimeout(advanceRef.current);
  }, []);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  function getButtonStyle(index: number) {
    if (!isAnswered) return styles.answerButton;
    if (index === question.correct) return [styles.answerButton, styles.correct];
    if (index === selectedAnswer)   return [styles.answerButton, styles.wrong];
    return styles.answerButton;
  }

  const multiplier = getMultiplier(displayStreak);
  const flashBg = isAnswered
    ? (selectedAnswer === question.correct ? '#bbf7d0' : '#fecaca')
    : '#fff';

  return (
    <View style={[styles.container, { backgroundColor: flashBg }]}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.timer}>⏱ {timeLeft}s</Text>
        <View style={styles.scoreWrap}>
          {multiplier > 1 && (
            <Text style={styles.multiplierBadge}>{multiplier}×</Text>
          )}
          <Text style={styles.score}>{displayScore.toLocaleString()}</Text>
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
      <Text style={styles.questionNumber}>
        Question {questionIndex + 1} / {questions.length}
      </Text>
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
            style={getButtonStyle(i)}
            onPress={() => handleAnswer(i)}
            disabled={isAnswered}
          >
            <Text style={styles.answerText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, padding: 24, paddingTop: 60 },
  header:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  timer:       { fontSize: 22, fontWeight: 'bold' },
  scoreWrap:   { flexDirection: 'row', alignItems: 'center', gap: 8 },
  score:       { fontSize: 22, fontWeight: 'bold' },
  multiplierBadge: {
    backgroundColor: '#FFD23F', paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 6, fontSize: 14, fontWeight: '900', color: '#1A1522', overflow: 'hidden',
  },
  streakLabel: { fontSize: 14, fontWeight: '700', color: '#f97316', marginBottom: 4 },
  missLabel:   { fontSize: 12, fontWeight: '700', color: '#dc2626', marginBottom: 4 },
  questionNumber: { fontSize: 14, color: '#6b7280', marginBottom: 12 },
  question:    { fontSize: 26, fontWeight: '600', marginBottom: 32, lineHeight: 36 },
  flashWrap:   { alignItems: 'center', marginBottom: 8 },
  pointsFlash: { fontSize: 22, fontWeight: '900', color: '#16a34a', textAlign: 'center' },
  pointsNeg:   { color: '#dc2626' },
  bonusLabel:  { fontSize: 11, fontWeight: '700', color: '#16a34a', letterSpacing: 0.5, textTransform: 'uppercase', marginTop: 3 },
  answers:     { gap: 16 },
  answerButton: { backgroundColor: '#e5e7eb', padding: 18, borderRadius: 10 },
  lockedBtn:   { opacity: 0.55 },
  correct:     { backgroundColor: '#16a34a' },
  wrong:       { backgroundColor: '#dc2626' },
  answerText:  { fontSize: 18, fontWeight: '500', textAlign: 'center' },
});
