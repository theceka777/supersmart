// daily.tsx — Daily Race mode
// 60 questions, seeded by date (same set for everyone globally).
// 60-second total countdown. Same scoring as Quickmatch.
// 1-second UI lock per question. Timer expiry ends the game.
// One play per calendar day.
//
// All mutable game values live in refs so submitAnswer never reads stale closures.

import { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { QUESTIONS, Question } from './questions';
import { useAppStore } from './store';
import { Colors, Fonts, Radius, CARD_DEPTH } from '@/constants/theme';

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
    if (!isAnswered) return s.answerButton;
    if (index === question.correct) return [s.answerButton, s.correct];
    if (index === selectedAnswer)   return [s.answerButton, s.wrong];
    return [s.answerButton, s.dim];
  }

  function getAnswerTextStyle(index: number) {
    if (!isAnswered) return s.answerText;
    if (index === question.correct || index === selectedAnswer) return [s.answerText, s.answerTextLight];
    return s.answerText;
  }

  const multiplier = getMultiplier(displayStreak);
  const timerColor = timeLeft <= 10 ? Colors.red : timeLeft <= 20 ? '#f59e0b' : Colors.ink;

  // Flash background on answer
  const flashBg = isAnswered
    ? (selectedAnswer === question.correct ? '#bbf7d0' : '#fecaca')
    : Colors.cream;

  // ── Already played ─────────────────────────────────────────────────────────
  if (alreadyPlayed) {
    const correct = dailyStatus.results.filter(Boolean).length;
    const total   = dailyStatus.results.length;
    const grid    = dailyStatus.results.map(r => r ? '🟩' : '🟥').join('');
    const shareText = `Super Smart Daily — ${correct}/${total} · ${dailyStatus.score.toLocaleString()} pts\n${grid}`;

    return (
      <View style={s.alreadyContainer}>
        <Text style={s.modeTag}>DAILY RACE</Text>

        <View style={s.scoreCard}>
          <Text style={s.bigScore}>
            {correct}<Text style={s.bigScoreDim}>/{total}</Text>
          </Text>
          <Text style={s.ptsLabel}>{dailyStatus.score.toLocaleString()} pts</Text>
        </View>

        <Text style={s.gridText}>{grid}</Text>

        <View style={s.shareCard}>
          <Text style={s.shareHeader}>share your result</Text>
          <Text style={s.shareText}>{shareText}</Text>
        </View>

        <Pressable style={s.homeBtn} onPress={() => router.replace('/')}>
          <View style={s.homeBtnShadow} />
          <View style={s.homeBtnFace}>
            <Text style={s.homeBtnText}>HOME</Text>
          </View>
        </Pressable>

        <Text style={s.comeBack}>new race tomorrow at 6am.</Text>
      </View>
    );
  }

  if (!question) return null;

  return (
    <View style={[s.container, { backgroundColor: flashBg }]}>

      {/* Header */}
      <View style={s.header}>
        <Text style={s.modeTagInline}>DAILY RACE</Text>
        <View style={s.headerRight}>
          {multiplier > 1 && (
            <Text style={s.multiplierBadge}>{multiplier}×</Text>
          )}
          <Text style={[s.timer, { color: timerColor }]}>{timeLeft}s</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={s.progressBar}>
        <View style={[s.progressFill, { width: `${(questionIndex / questions.length) * 100}%` as any }]} />
      </View>

      {/* Sub-header */}
      <View style={s.subHeader}>
        <Text style={s.questionNum}>{questionIndex + 1} / {questions.length}</Text>
        <Text style={s.scoreText}>{displayScore.toLocaleString()} pts</Text>
      </View>

      {/* Status strips */}
      {displayStreak >= 3 && (
        <Text style={s.streakLabel}>🔥 {displayStreak} streak</Text>
      )}
      {displayMiss >= 2 && (
        <Text style={s.missLabel}>⚠️ {displayMiss}/3 misses</Text>
      )}

      {/* Question */}
      <Text style={s.question}>{question.question}</Text>

      {/* Points flash */}
      {isAnswered && lastPoints !== null && (
        <View style={s.flashWrap}>
          <Text style={[s.pointsFlash, lastPoints < 0 && s.pointsNeg]}>
            {lastPoints > 0 ? `+${lastPoints}` : `${lastPoints}`}
          </Text>
          {lastLabel ? <Text style={s.bonusLabel}>{lastLabel}</Text> : null}
        </View>
      )}

      {/* Answer buttons */}
      <View style={s.answers}>
        {question.options.map((option, i) => (
          <TouchableOpacity
            key={i}
            style={[getButtonStyle(i), (locked && !isAnswered) && s.lockedBtn]}
            onPress={() => submitAnswer(i)}
            disabled={isAnswered || locked}
          >
            <Text style={getAnswerTextStyle(i)}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

    </View>
  );
}

const s = StyleSheet.create({
  // ── Game screen ──────────────────────────────────────────────────────────────
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modeTagInline: {
    fontFamily: Fonts.black,
    fontSize: 14,
    color: Colors.ink,
    letterSpacing: 1,
  },
  timer: {
    fontFamily: Fonts.black,
    fontSize: 22,
    letterSpacing: -0.5,
  },
  multiplierBadge: {
    backgroundColor: Colors.yellow,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    fontFamily: Fonts.black,
    fontSize: 14,
    color: Colors.ink,
    overflow: 'hidden',
  },

  progressBar: {
    height: 6,
    backgroundColor: Colors.ink,
    borderRadius: Radius.pill,
    marginBottom: 10,
    overflow: 'hidden',
    opacity: 0.12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.ink,
    opacity: 10, // restores full ink inside the dimmed container
    borderRadius: Radius.pill,
  },

  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  questionNum: {
    fontFamily: Fonts.mono,
    fontSize: 13,
    color: Colors.ink,
    opacity: 0.4,
  },
  scoreText: {
    fontFamily: Fonts.mono,
    fontSize: 13,
    color: Colors.ink,
    opacity: 0.4,
  },

  streakLabel: {
    fontFamily: Fonts.mono,
    fontSize: 13,
    color: '#f97316',
    fontWeight: '700',
    marginBottom: 4,
  },
  missLabel: {
    fontFamily: Fonts.mono,
    fontSize: 12,
    color: Colors.red,
    fontWeight: '700',
    marginBottom: 4,
  },

  question: {
    fontFamily: Fonts.black,
    fontSize: 24,
    color: Colors.ink,
    marginBottom: 24,
    lineHeight: 32,
  },

  flashWrap: {
    alignItems: 'center',
    marginBottom: 6,
  },
  pointsFlash: {
    fontFamily: Fonts.black,
    fontSize: 22,
    color: '#16a34a',
    textAlign: 'center',
  },
  pointsNeg: {
    color: Colors.red,
  },
  bonusLabel: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: '#16a34a',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: 3,
  },

  answers: {
    gap: 12,
  },
  answerButton: {
    backgroundColor: Colors.cream,
    padding: 18,
    borderRadius: Radius.sm,
    borderWidth: 3,
    borderColor: Colors.ink,
  },
  lockedBtn: {
    opacity: 0.55,
  },
  correct: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  wrong: {
    backgroundColor: Colors.red,
    borderColor: Colors.red,
  },
  dim: {
    opacity: 0.4,
  },
  answerText: {
    fontFamily: Fonts.mono,
    fontSize: 17,
    color: Colors.ink,
    textAlign: 'center',
  },
  answerTextLight: {
    color: Colors.cream,
  },

  // ── Already played screen ────────────────────────────────────────────────────
  alreadyContainer: {
    flex: 1,
    backgroundColor: Colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    gap: 16,
  },

  modeTag: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: Colors.ink,
    opacity: 0.4,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  scoreCard: {
    width: '100%',
    backgroundColor: Colors.cream,
    borderRadius: Radius.card,
    borderWidth: 3,
    borderColor: Colors.ink,
    padding: 24,
    alignItems: 'center',
    gap: 4,
  },
  bigScore: {
    fontFamily: Fonts.black,
    fontSize: 72,
    color: Colors.ink,
    lineHeight: 80,
  },
  bigScoreDim: {
    color: Colors.ink,
    opacity: 0.3,
    fontSize: 48,
  },
  ptsLabel: {
    fontFamily: Fonts.mono,
    fontSize: 14,
    color: Colors.ink,
    opacity: 0.45,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  gridText: {
    fontSize: 24,
    letterSpacing: 3,
    flexWrap: 'wrap',
    textAlign: 'center',
    lineHeight: 32,
  },

  shareCard: {
    width: '100%',
    backgroundColor: Colors.cream,
    borderRadius: Radius.card,
    borderWidth: 3,
    borderColor: Colors.ink,
    padding: 20,
    gap: 8,
    alignItems: 'center',
  },
  shareHeader: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    color: Colors.ink,
    opacity: 0.4,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  shareText: {
    fontFamily: Fonts.mono,
    fontSize: 14,
    color: Colors.ink,
    textAlign: 'center',
    lineHeight: 26,
  },

  homeBtn:       { width: '100%', position: 'relative', height: 52 + CARD_DEPTH },
  homeBtnShadow: { position: 'absolute', left: 0, right: 0, top: CARD_DEPTH, height: 52, backgroundColor: Colors.ink, borderRadius: Radius.sm },
  homeBtnFace:   { position: 'absolute', left: 0, right: 0, top: 0, height: 52, backgroundColor: Colors.yellow, borderRadius: Radius.sm, borderWidth: 3, borderColor: Colors.ink, alignItems: 'center', justifyContent: 'center' },
  homeBtnText:   { fontFamily: Fonts.black, fontSize: 16, color: Colors.ink, letterSpacing: 0.5 },

  comeBack: {
    fontFamily: Fonts.mono,
    fontSize: 12,
    color: Colors.ink,
    opacity: 0.35,
    marginTop: 4,
  },
});
