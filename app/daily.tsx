// daily.tsx — Daily Race mode
// 60 questions, seeded by date (same set for everyone globally).
// 60-second total countdown. Same scoring as Quickmatch.
// 1-second UI lock per question. Timer expiry ends the game.
// One play per calendar day.
//
// All mutable game values live in refs so submitAnswer never reads stale closures.

import { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { QUESTIONS, Question } from './questions';
import { useAppStore } from './store';

const TOTAL_TIME = 60;
const QUESTION_COUNT = 60;
const FREE_LIMIT = 7;
const LOCK_MS = 1000;
const SPEED_MS = 2000;
const BASE_PTS = 100;
const SPEED_BONUS = 50;
const MISS_PENALTY = 50;
const MISS_THRESHOLD = 3;

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function getDailyQuestions(): Question[] {
  const d = new Date();
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  const rand = seededRandom(seed);
  const arr = [...QUESTIONS];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, QUESTION_COUNT).map(q => {
    const correctText = q.options[q.correct];
    const opts = [...q.options] as [string, string, string];
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    return { ...q, options: opts, correct: opts.indexOf(correctText) };
  });
}

function getMultiplier(streak: number): number {
  if (streak >= 7) return 4;
  if (streak >= 5) return 3;
  if (streak >= 3) return 2;
  return 1;
}

export default function DailyScreen() {
  const router = useRouter();
  const { dailyStatus, setDailyPlayed, freePlay, recordPlay } = useAppStore();
  const today = new Date().toISOString().split('T')[0];
  const alreadyPlayed = dailyStatus.date === today && dailyStatus.played;

  useEffect(() => {
    if (alreadyPlayed) return;
    const playsToday = freePlay.date === today ? freePlay.playsToday : 0;
    const oneMoreTaps = freePlay.date === today ? freePlay.oneMoreTaps : 0;
    if (playsToday >= FREE_LIMIT + oneMoreTaps * 3) {
      router.replace('/');
    } else {
      recordPlay();
    }
  }, []);

  const [questions] = useState(getDailyQuestions);

  // ── Refs: source of truth ──────────────────────────────────────────────────
  const scoreRef         = useRef(0);
  const streakRef        = useRef(0);
  const missRef          = useRef(0);
  const resultsRef       = useRef<boolean[]>([]);
  const questionStartRef = useRef(0);
  const canAnswerRef     = useRef(false);

  // ── State: display only ────────────────────────────────────────────────────
  const [questionIndex,   setQuestionIndex]   = useState(0);
  const [timeLeft,        setTimeLeft]        = useState(TOTAL_TIME);
  const [selectedAnswer,  setSelectedAnswer]  = useState<number | null>(null);
  const [displayScore,    setDisplayScore]    = useState(0);
  const [displayStreak,   setDisplayStreak]   = useState(0);
  const [displayMiss,     setDisplayMiss]     = useState(0);
  const [lastPoints,      setLastPoints]      = useState<number | null>(null);
  const [lastLabel,       setLastLabel]       = useState('');
  const [locked,          setLocked]          = useState(true);

  const timerRef     = useRef<ReturnType<typeof setInterval> | null>(null);
  const advanceRef   = useRef<ReturnType<typeof setTimeout>  | null>(null);
  const lockTimerRef = useRef<ReturnType<typeof setTimeout>  | null>(null);

  const question   = questions[questionIndex];
  const isAnswered = selectedAnswer !== null;

  // ── 60-second countdown ────────────────────────────────────────────────────
  useEffect(() => {
    if (alreadyPlayed) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current!); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => {
      clearInterval(timerRef.current!);
      if (advanceRef.current)  clearTimeout(advanceRef.current);
      if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    };
  }, []);

  // Timer expiry → end with latest ref values
  useEffect(() => {
    if (timeLeft === 0 && !alreadyPlayed) {
      setDailyPlayed(scoreRef.current, resultsRef.current);
      const encoded = resultsRef.current.map(r => r ? '1' : '0').join('');
      router.replace(`/end?score=${scoreRef.current}&mode=daily&results=${encoded}`);
    }
  }, [timeLeft]);

  // ── 1-second UI lock per question ──────────────────────────────────────────
  useEffect(() => {
    if (alreadyPlayed) return;
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
  }, [questionIndex]);

  // ── Answer handler ─────────────────────────────────────────────────────────
  function submitAnswer(index: number) {
    if (isAnswered || !canAnswerRef.current || alreadyPlayed) return;
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
    resultsRef.current = [...resultsRef.current, isCorrect];

    setDisplayScore(scoreRef.current);
    setDisplayStreak(streakRef.current);
    setDisplayMiss(missRef.current);
    setLastPoints(delta !== 0 ? delta : null);
    setLastLabel(label);

    advanceRef.current = setTimeout(() => {
      const next = questionIndex + 1;
      if (next >= questions.length) {
        setDailyPlayed(scoreRef.current, resultsRef.current);
        const encoded = resultsRef.current.map(r => r ? '1' : '0').join('');
        router.replace(`/end?score=${scoreRef.current}&mode=daily&results=${encoded}`);
      } else {
        setSelectedAnswer(null);
        setLastPoints(null);
        setLastLabel('');
        setQuestionIndex(next);
      }
    }, isCorrect ? 800 : 1500);
  }

  useEffect(() => () => {
    if (advanceRef.current) clearTimeout(advanceRef.current);
  }, []);

  function getButtonStyle(index: number) {
    if (!isAnswered) return styles.answerButton;
    if (index === question.correct) return [styles.answerButton, styles.correct];
    if (index === selectedAnswer)   return [styles.answerButton, styles.wrong];
    return [styles.answerButton, styles.dim];
  }

  const multiplier = getMultiplier(displayStreak);
  const timerColor = timeLeft <= 10 ? '#dc2626' : timeLeft <= 20 ? '#f59e0b' : '#111827';

  // ── Already played ─────────────────────────────────────────────────────────
  if (alreadyPlayed) {
    const correct = dailyStatus.results.filter(Boolean).length;
    const total   = dailyStatus.results.length;
    const grid    = dailyStatus.results.map(r => r ? '🟩' : '🟥').join('');
    return (
      <View style={styles.container}>
        <Text style={styles.title}>DAILY RACE</Text>
        <Text style={styles.alreadyLabel}>Already played today</Text>
        <Text style={styles.alreadyScore}>{correct}/{total}</Text>
        <Text style={styles.grid}>{grid}</Text>
        <View style={styles.shareBox}>
          <Text style={styles.shareText}>
            Super Smart Daily — {correct}/{total} · {dailyStatus.score.toLocaleString()} pts{'\n'}{grid}
          </Text>
        </View>
        <Text style={styles.comeBack}>New race resets at 6am.</Text>
      </View>
    );
  }

  if (!question) return null;

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>DAILY RACE</Text>
        <View style={styles.headerRight}>
          <Text style={[styles.timer, { color: timerColor }]}>{timeLeft}s</Text>
          {multiplier > 1 && (
            <Text style={styles.multiplierBadge}>{multiplier}×</Text>
          )}
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(questionIndex / questions.length) * 100}%` }]} />
      </View>

      {/* Sub-header */}
      <View style={styles.subHeader}>
        <Text style={styles.questionNum}>{questionIndex + 1} / {questions.length}</Text>
        <Text style={styles.scoreText}>{displayScore.toLocaleString()} pts</Text>
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
            onPress={() => submitAnswer(i)}
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
  container:   { flex: 1, backgroundColor: '#fff', padding: 24, paddingTop: 60 },
  header:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title:       { fontSize: 22, fontWeight: '900', color: '#0e7490', letterSpacing: 1 },
  timer:       { fontSize: 24, fontWeight: '800' },
  multiplierBadge: {
    backgroundColor: '#FFD23F', paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 6, fontSize: 14, fontWeight: '900', color: '#1A1522', overflow: 'hidden',
  },
  progressBar:  { height: 6, backgroundColor: '#e5e7eb', borderRadius: 3, marginBottom: 10, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#7BEFFC', borderRadius: 3 },
  subHeader:    { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  questionNum:  { fontSize: 13, color: '#9ca3af', fontWeight: '600' },
  scoreText:    { fontSize: 13, color: '#9ca3af', fontWeight: '600' },
  streakLabel:  { fontSize: 14, fontWeight: '700', color: '#f97316', marginBottom: 4 },
  missLabel:    { fontSize: 12, fontWeight: '700', color: '#dc2626', marginBottom: 4 },
  question:     { fontSize: 24, fontWeight: '600', color: '#111827', marginBottom: 24, lineHeight: 32 },
  flashWrap:    { alignItems: 'center', marginBottom: 6 },
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
  alreadyLabel: { fontSize: 18, color: '#6b7280', marginTop: 24 },
  alreadyScore: { fontSize: 80, fontWeight: '900', color: '#0e7490' },
  grid:         { fontSize: 20, letterSpacing: 2, flexWrap: 'wrap' },
  shareBox:     { backgroundColor: '#f9fafb', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  shareText:    { fontSize: 15, color: '#374151', fontWeight: '600', textAlign: 'center', lineHeight: 28 },
  comeBack:     { fontSize: 14, color: '#9ca3af', marginTop: 12 },
});
