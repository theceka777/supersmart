// daily.tsx — Daily Race mode
// 60 questions, seeded by date (same set for everyone globally).
// 60-second total countdown. Same scoring as Quickmatch.
// 1-second UI lock per question. Timer expiry ends the game.
// One play per calendar day.
//
// All mutable game values live in refs so submitAnswer never reads stale closures.

import { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable, AppState } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { QUESTIONS, Question } from './questions';
import { useAppStore } from './store';
import { getRankLabel } from './content';
import { Colors, Fonts, Radius, CARD_DEPTH } from '@/constants/theme';

// Longest run of consecutive `true` values in the results array.
// Used for the Daily Race share text — a natural-language comparator
// ("my best streak was 7") that works across players with different
// answered-question counts.
function peakStreak(results: boolean[]): number {
  let peak = 0, run = 0;
  for (const r of results) {
    if (r) { run += 1; if (run > peak) peak = run; }
    else   { run = 0; }
  }
  return peak;
}

// "Apr 24" short-format date.
function shortDate(d = new Date()): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const TOTAL_TIME = 60;
const QUESTION_COUNT = 60;
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

  // `currentlyPlaying` overrides the alreadyPlayed view during an active round.
  // We need this because progressive saves on each answer flip
  // dailyStatus.played → true mid-round (so force-quit captures the daily
  // attempt as used). Without this flag, the alreadyPlayed view would render
  // mid-round once we save the first answer. The flag is component-local —
  // lost on force-quit, which is correct behavior (next app open shows the
  // alreadyPlayed view since dailyStatus.played persisted).
  const initialAlreadyPlayed = dailyStatus.date === today && dailyStatus.played;
  const [currentlyPlaying, setCurrentlyPlaying] = useState(!initialAlreadyPlayed);
  const alreadyPlayed = dailyStatus.date === today && dailyStatus.played && !currentlyPlaying;

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

  const timerRef       = useRef<ReturnType<typeof setInterval> | null>(null);
  const advanceRef     = useRef<ReturnType<typeof setTimeout>  | null>(null);
  const lockTimerRef   = useRef<ReturnType<typeof setTimeout>  | null>(null);
  // Wall-clock anchor — timestamp at which the round began.
  // timeLeft = max(0, 60 - elapsedSinceStart). Never decrements.
  const roundStartRef  = useRef<number | null>(null);

  const question   = questions[questionIndex];
  const isAnswered = selectedAnswer !== null;

  // ── 60-second countdown — wall-clock based ──────────────────────────────────
  // The interval triggers re-renders that recompute timeLeft from
  // (now - roundStart). Robust to JS pause/resume during app switcher,
  // background, or slow-phone irregular ticks.
  useEffect(() => {
    if (alreadyPlayed) return;
    if (roundStartRef.current === null) {
      roundStartRef.current = Date.now();
    }
    const tick = () => {
      if (roundStartRef.current === null) return;
      const elapsed = Math.floor((Date.now() - roundStartRef.current) / 1000);
      setTimeLeft(Math.max(0, 60 - elapsed));
    };
    tick();
    timerRef.current = setInterval(tick, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
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

  // ── Lock-on-exit (anti-cheat) ──────────────────────────────────────────────
  // Per mothership Part 3: NAVIGATION away (hardware back, iOS swipe-back,
  // programmatic nav) locks the score and uses today's daily attempt — no
  // replay until tomorrow's reset. BACKGROUNDING (notification, Control
  // Center, phone call, app switch) does NOT lock — the timer keeps running
  // on wall-clock time, the player loses time but can resume. Force-quit
  // captures the latest persisted score (setDailyPlayed called progressively
  // in submitAnswer below).
  function lockScoreOnExit() {
    if (alreadyPlayed) return;             // already locked, nothing to do
    if (timerRef.current)     clearInterval(timerRef.current);
    if (advanceRef.current)   clearTimeout(advanceRef.current);
    if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    setCurrentlyPlaying(false);
    setDailyPlayed(scoreRef.current, resultsRef.current);
  }

  // On foreground, immediately recompute timeLeft from wall-clock so the UI
  // snaps to the correct value (instead of waiting up to 1s for the next
  // interval tick). Wall-clock math handles the elapsed time intrinsically —
  // no double-subtraction bug.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (alreadyPlayed || roundStartRef.current === null) return;
      if (state === 'active') {
        const elapsed = Math.floor((Date.now() - roundStartRef.current) / 1000);
        setTimeLeft(Math.max(0, 60 - elapsed));
      }
    });
    return () => sub.remove();
  }, [alreadyPlayed]);

  // Navigation away (hardware back, iOS swipe back, programmatic nav)
  useFocusEffect(
    useCallback(() => {
      return () => lockScoreOnExit();
    }, [alreadyPlayed])
  );

  // ── 150ms invisible double-tap guardrail per question ──────────────────────
  // Speed-bonus timer anchors at question render — the 2-second window
  // encompasses read + decide + tap. No free read buffer; the corpus's
  // ≤40-char prompts make this feasible.
  useEffect(() => {
    if (alreadyPlayed) return;
    canAnswerRef.current = false;
    questionStartRef.current = Date.now();
    lockTimerRef.current = setTimeout(() => {
      canAnswerRef.current = true;
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

    // Progressive save — captures the daily attempt + latest score for
    // force-quit / OS-kill scenarios. The currentlyPlaying flag prevents
    // the alreadyPlayed view from triggering mid-round even though
    // dailyStatus.played flips to true here.
    setDailyPlayed(scoreRef.current, resultsRef.current);

    // Unified 1-second post-answer beat — same for right, wrong, or with
    // power-up. Predictable rhythm across the full round.
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
    }, 1000);
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
    const rank    = getRankLabel(dailyStatus.score);
    const peak    = peakStreak(dailyStatus.results);
    // 3-line scoreboard — fixed-shape, pastes cleanly into any chat.
    // (The 60-sq grid is kept on-screen as a reflective moment but NOT shared,
    //  since its length varies per player and it loses its story outside the app.)
    const shareText =
      `Super Smart Daily · ${shortDate()}\n` +
      `⚡ ${dailyStatus.score.toLocaleString()} pts · rank: ${rank}\n` +
      `🔥 best streak · ${peak}`;

    return (
      <View style={s.alreadyContainer}>
        <View style={s.modeTagPill}>
          <Text style={s.modeTagPillText}>DAILY RACE</Text>
        </View>

        <View style={s.scoreCard}>
          {/* Points = hero */}
          <Text style={s.bigScore}>{dailyStatus.score.toLocaleString()}</Text>
          <Text style={s.ptsLabel}>points</Text>
          {/* Accuracy = small context line */}
          <Text style={s.accuracyLine}>{correct} of {total} correct</Text>
        </View>

        {/* On-screen reflective moment: how your round went, question-by-question */}
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

  // Short date label for the "vs. the world" pill — e.g. "Apr 24"
  const dateLabel = shortDate();

  return (
    <View style={[s.container, { backgroundColor: flashBg }]}>

      {/* ── Header (3-col, parallel to Quickmatch) ───────────────────────── */}
      <View style={s.header}>

        {/* Timer */}
        <View style={s.timerWrap}>
          <Text style={[s.timer, { color: timerColor }]}>{timeLeft}</Text>
          <Text style={[s.timerUnit, { color: timerColor }]}>s</Text>
        </View>

        {/* Center slot — cyan "vs. the world" pill (Daily's mode identity) */}
        <View style={s.worldPill}>
          <Text style={s.worldPillLabel}>vs. the world</Text>
          <Text style={s.worldPillDate}>{dateLabel}</Text>
        </View>

        {/* Score + multiplier */}
        <View style={s.scoreWrap}>
          {multiplier > 1 && (
            <View style={s.multPill}>
              <Text style={s.multText}>{multiplier}×</Text>
            </View>
          )}
          <Text style={s.score}>{displayScore.toLocaleString()}</Text>
        </View>

      </View>

      {/* Divider */}
      <View style={s.divider} />

      {/* Status strips */}
      {displayStreak >= 3 && (
        <Text style={s.streakLabel}>🔥 {displayStreak} streak</Text>
      )}
      {displayMiss >= 2 && (
        <Text style={s.missLabel}>⚠️ {displayMiss}/3 misses</Text>
      )}

      {/* ── Question zone ────────────────────────────────────────────────── */}
      <View style={s.questionZone}>
        <Text style={s.qNumber}>Q {questionIndex + 1}</Text>
        <Text style={s.question}>{question.question}</Text>
      </View>

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
            style={getButtonStyle(i)}
            onPress={() => submitAnswer(i)}
            disabled={isAnswered}
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
    paddingHorizontal: 20,
    paddingTop: 56,
  },

  // Header — 3-col parallel to Quickmatch: [timer] [center slot] [score + mult]
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  timerWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
    minWidth: 60,
  },
  timer: {
    fontFamily: Fonts.black,
    fontSize: 34,
    lineHeight: 38,
  },
  timerUnit: {
    fontFamily: Fonts.mono,
    fontSize: 14,
    marginLeft: 2,
    opacity: 0.6,
  },

  // "vs. the world · Apr 24" — Daily's mode-identity pill (cyan accent)
  worldPill: {
    alignItems: 'center',
    backgroundColor: Colors.dailyrace.bg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    borderWidth: 2,
    borderColor: Colors.ink,
  },
  worldPillLabel: {
    fontFamily: Fonts.black,
    fontSize: 11,
    color: Colors.ink,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  worldPillDate: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    color: Colors.ink,
    opacity: 0.65,
    letterSpacing: 0.3,
    marginTop: 1,
  },

  scoreWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'flex-end',
    minWidth: 80,
  },
  multPill: {
    backgroundColor: Colors.yellow,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.pill,
    borderWidth: 2,
    borderColor: Colors.ink,
  },
  multText: {
    fontFamily: Fonts.black,
    fontSize: 13,
    color: Colors.ink,
  },
  score: {
    fontFamily: Fonts.black,
    fontSize: 22,
    color: Colors.ink,
  },

  divider: {
    height: 2,
    backgroundColor: Colors.ink,
    opacity: 0.08,
    marginBottom: 12,
  },

  streakLabel: {
    fontFamily: Fonts.black,
    fontSize: 13,
    color: '#ea580c',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  missLabel: {
    fontFamily: Fonts.mono,
    fontSize: 12,
    color: Colors.red,
    fontWeight: '700',
    marginBottom: 4,
  },

  // Question
  questionZone: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 4,
  },
  qNumber: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: Colors.ink,
    opacity: 0.35,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  question: {
    fontFamily: Fonts.black,
    fontSize: 28,
    color: Colors.ink,
    lineHeight: 36,
    letterSpacing: -0.5,
  },

  flashWrap: {
    alignItems: 'center',
    marginBottom: 10,
  },
  pointsFlash: {
    fontFamily: Fonts.black,
    fontSize: 30,
    color: '#16a34a',
    letterSpacing: -1,
  },
  pointsNeg: { color: Colors.red },
  bonusLabel: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    color: '#16a34a',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 3,
  },

  answers: {
    gap: 10,
    paddingBottom: 32,
  },
  answerButton: {
    backgroundColor: Colors.cream,
    padding: 18,
    borderRadius: Radius.sm,
    borderWidth: 3,
    borderColor: Colors.ink,
  },
  lockedBtn: { opacity: 0.55 },
  correct: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  wrong: {
    backgroundColor: Colors.red,
    borderColor: Colors.red,
  },
  dim: { opacity: 0.4 },
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

  // Cyan mode tag pill — the mode accent for Daily Race
  modeTagPill: {
    backgroundColor: Colors.dailyrace.bg,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: Radius.pill,
    borderWidth: 2,
    borderColor: Colors.ink,
  },
  modeTagPillText: {
    fontFamily: Fonts.black,
    fontSize: 12,
    color: Colors.ink,
    letterSpacing: 2,
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
  // Points = hero
  bigScore: {
    fontFamily: Fonts.black,
    fontSize: 72,
    color: Colors.ink,
    lineHeight: 80,
  },
  ptsLabel: {
    fontFamily: Fonts.mono,
    fontSize: 14,
    color: Colors.ink,
    opacity: 0.45,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  // Accuracy = small context line under the points
  accuracyLine: {
    fontFamily: Fonts.mono,
    fontSize: 12,
    color: Colors.ink,
    opacity: 0.55,
    letterSpacing: 0.5,
    marginTop: 6,
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
