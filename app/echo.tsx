// echo.tsx — Quickmatch (ghost race) mode
// Playing-phase redesign: Cream Stadium aesthetic, ArcadeCard-style answer buttons.
// All game logic unchanged — only JSX + styles updated.

import { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator, AppState } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { QUESTIONS, shuffleQuestions } from './questions';
import { EMOTES, pickInterviewEmotes, getRankLabel } from './content';
import { Avatar } from '@/components/Avatar';
import { useAppStore } from './store';
import { Colors, Fonts, Radius, CARD_DEPTH } from '@/constants/theme';

// ─── Constants ────────────────────────────────────────────────────────────────

// Ghost name pool — mothership v1.23 bot-ghost rule: deliberately NO single pattern.
// Mixed styles (adjective+noun, firstname+number, curated handles) so players
// cannot identify bots from name alone. Pool is ~30 to keep repeats rare.
// When Phase 4 matchmaking Edge Function lands, this pool moves server-side.
const GHOST_NAMES = [
  // Adjective + Noun (10)
  'SleepyKoala', 'BrightFern', 'EagerMango', 'QuietRiver', 'LoudPeach',
  'WarmGranite', 'CrookedLamp', 'BoldSparrow', 'LazyWillow', 'CrispLemon',
  // First name + number (10)
  'Maya42', 'Leo7', 'Noah19', 'Zoe88', 'Kai3',
  'Aria55', 'Theo21', 'Luna9', 'Ezra14', 'Juno6',
  // Curated handles (10)
  'biscuit_tin', 'moss.pilot', 'trivia-crab', 'lemonharbor', 'oakly',
  'june1st', 'cat_of_9', 'halfmoon', 'paperboat', 'velvet.hum',
];

// Ghost colors: full 8-color library including Pro-locked shades.
// Mothership v1.23: bot avatars draw from the full library including Pro items
// — soft exposure to purchasable cosmetics.
// Free (4): pink, blue, green, orange. Pro (4): purple, gold, teal, ember.
const GHOST_COLORS = [
  '#FF6B9D', '#6B9DFF', '#6BDB6B', '#FFB86B',  // free tier
  '#B86BFF', '#FFD700', '#40E0D0', '#FF4D4D',  // pro tier
];

// Eye and mouth id pools — both include Pro tier items. Keys match the
// Avatar component's EYES/MOUTHS dictionaries (see components/Avatar.tsx).
const GHOST_EYES   = ['round', 'square', 'sleepy', 'wink', 'stars', 'dots', 'wide', 'closed'];
const GHOST_MOUTHS = ['smile', 'neutral', 'smirk', 'ohh', 'grin', 'tongue', 'flat', 'open'];

const GHOST_TIMES  = ['played 47 min ago', 'played 2 hours ago', 'played yesterday', 'played 3 hours ago'];

// Ghost emote: randomly mocking or supportive — the real emote library, not placeholders.
// Mocking = ghost trash-talking you before the race. Supportive = ghost cheering you on.
function pickGhostEmote(): string {
  const pool = EMOTES.filter(e => e.active && (e.category === 'mocking' || e.category === 'supportive'));
  return pool[Math.floor(Math.random() * pool.length)].text;
}

function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Bot ghost final score — mothership v1.23: random within 300–3,000,
// INDEPENDENT of the player's actual score. The low floor means new players
// typically win their first few games. Generated once at match start; revealed
// at round end.
function generateBotScore(): number {
  return 300 + Math.floor(Math.random() * 2701); // 300..3000 inclusive
}

const FREE_LIMIT     = 7;
// Invisible double-tap guardrail. 150ms is below the human reaction-time
// floor (~200ms), so the button-disable is imperceptible — but it filters
// out rhythmic-tap accidents where a player's finger is mid-motion when
// the next question renders. No visual lock state; canAnswerRef handles it.
const LOCK_MS        = 150;
const SPEED_MS       = 2000;
const BASE_PTS       = 100;
const SPEED_BONUS    = 50;
const MISS_PENALTY   = 50;
const MISS_THRESHOLD = 3;
const BTN_H          = 58;

function getMultiplier(streak: number): number {
  if (streak >= 7) return 4;
  if (streak >= 5) return 3;
  if (streak >= 3) return 2;
  return 1;
}

// ─── Answer button ────────────────────────────────────────────────────────────

type BtnState = 'idle' | 'locked' | 'correct' | 'wrong' | 'dim';

function AnswerButton({
  option,
  onPress,
  state,
}: {
  option: string;
  onPress: () => void;
  state: BtnState;
}) {
  const press = useSharedValue(0);

  const faceAnim = useAnimatedStyle(() => ({
    transform: [{ translateY: press.value * CARD_DEPTH }],
  }));

  const isDisabled = state !== 'idle';
  const faceColor =
    state === 'correct' ? '#22c55e' :
    state === 'wrong'   ? Colors.red :
    Colors.cream;
  const textColor = (state === 'correct' || state === 'wrong') ? Colors.cream : Colors.ink;

  return (
    <Pressable
      onPressIn={() => {
        if (!isDisabled) press.value = withSpring(1, { mass: 0.2, damping: 12, stiffness: 500 });
      }}
      onPressOut={() => {
        press.value = withSpring(0, { mass: 0.2, damping: 14, stiffness: 400 });
      }}
      onPress={isDisabled ? undefined : onPress}
    >
      <View style={[btn.wrap, (state === 'dim' || state === 'locked') && btn.dimmed]}>
        <View style={btn.shadow} />
        <Animated.View style={[btn.face, { backgroundColor: faceColor }, faceAnim]}>
          <Text style={[btn.text, { color: textColor }]}>{option}</Text>
        </Animated.View>
      </View>
    </Pressable>
  );
}

const btn = StyleSheet.create({
  wrap:   { position: 'relative', height: BTN_H + CARD_DEPTH },
  dimmed: { opacity: 0.4 },
  shadow: {
    position: 'absolute', left: 0, right: 0, top: CARD_DEPTH,
    height: BTN_H, backgroundColor: Colors.ink, borderRadius: Radius.sm,
  },
  face: {
    position: 'absolute', left: 0, right: 0, top: 0,
    height: BTN_H, borderRadius: Radius.sm, borderWidth: 3,
    borderColor: Colors.ink, justifyContent: 'center',
    alignItems: 'center', paddingHorizontal: 16,
  },
  text: { fontFamily: Fonts.black, fontSize: 17, textAlign: 'center' },
});

// ─── Main screen ──────────────────────────────────────────────────────────────

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
    eyes:  pick(GHOST_EYES),
    mouth: pick(GHOST_MOUTHS),
    emote: pickGhostEmote(),
    time:  pick(GHOST_TIMES),
    score: generateBotScore(),  // bot final score, 300-3000, revealed at round end
  });

  // ── Refs: source of truth ──────────────────────────────────────────────────
  const scoreRef         = useRef(0);
  const streakRef        = useRef(0);
  const missRef          = useRef(0);
  const questionStartRef = useRef(0);
  const canAnswerRef     = useRef(false);

  // ── State: display only ────────────────────────────────────────────────────
  const [questionIndex,  setQuestionIndex]  = useState(0);
  const [timeLeft,       setTimeLeft]       = useState(60);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [ghostScore,     setGhostScore]     = useState(0);
  const [displayScore,   setDisplayScore]   = useState(0);
  const [displayStreak,  setDisplayStreak]  = useState(0);
  const [displayMiss,    setDisplayMiss]    = useState(0);
  const [lastPoints,     setLastPoints]     = useState<number | null>(null);
  const [lastLabel,      setLastLabel]      = useState('');
  const [gameEmotes,     setGameEmotes]     = useState<string[]>([]);
  const [selectedEmote,  setSelectedEmote]  = useState<string | null>(null);

  const timerRef       = useRef<ReturnType<typeof setInterval> | null>(null);
  const nextRef        = useRef<ReturnType<typeof setTimeout>  | null>(null);
  const lockTimerRef   = useRef<ReturnType<typeof setTimeout>  | null>(null);
  // Wall-clock anchor — timestamp at which the playing phase began.
  // The timer always computes remaining = max(0, 60 - elapsedSinceStart),
  // never decrements. This makes the round timer robust to any JS pause/
  // resume cycle (app switcher, background, slow phone, irregular ticks).
  const roundStartRef  = useRef<number | null>(null);

  const question   = questions[questionIndex];
  const isAnswered = selectedAnswer !== null;

  // Matching → preview
  useEffect(() => {
    if (phase !== 'matching') return;
    const t = setTimeout(() => setPhase('preview'), 1500);
    return () => clearTimeout(t);
  }, [phase]);

  // 60-second countdown — wall-clock based. The interval just triggers
  // re-renders that recompute timeLeft from (now - roundStart). No decrements,
  // so any JS pause (app switcher, background) doesn't desync the timer.
  useEffect(() => {
    if (phase !== 'playing') return;
    if (roundStartRef.current === null) {
      roundStartRef.current = Date.now();
    }
    const tick = () => {
      if (roundStartRef.current === null) return;
      const elapsed = Math.floor((Date.now() - roundStartRef.current) / 1000);
      setTimeLeft(Math.max(0, 60 - elapsed));
    };
    tick(); // immediate fresh value on mount / phase entry
    timerRef.current = setInterval(tick, 1000);
    return () => {
      if (timerRef.current)     clearInterval(timerRef.current);
      if (nextRef.current)      clearTimeout(nextRef.current);
      if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    };
  }, [phase]);

  // Round ends when timeLeft hits 0 (natural or via background catch-up).
  useEffect(() => {
    if (phase === 'playing' && timeLeft === 0) {
      finishGame();
    }
  }, [timeLeft, phase]);

  // 150ms invisible double-tap guardrail per question. Speed-bonus timer
  // anchors at question render — the 2-second window encompasses read +
  // decide + tap (no free read buffer; the corpus's ≤40-char prompts
  // make this feasible).
  useEffect(() => {
    if (phase !== 'playing') return;
    canAnswerRef.current = false;
    questionStartRef.current = Date.now();
    lockTimerRef.current = setTimeout(() => {
      canAnswerRef.current = true;
    }, LOCK_MS);
    return () => { if (lockTimerRef.current) clearTimeout(lockTimerRef.current); };
  }, [questionIndex, phase]);

  // Answer handler
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
    // Progressive save — captures latest score for force-quit / OS-kill
    // scenarios. updateHighScore is idempotent (only writes if PB).
    updateHighScore('quickmatch', scoreRef.current);
    setDisplayStreak(streakRef.current);
    setDisplayMiss(missRef.current);
    setLastPoints(delta !== 0 ? delta : null);
    setLastLabel(label);

    // Unified 1-second post-answer beat — same for right, wrong, or with
    // power-up. Predictable rhythm = better flow. After 1s, advance to next
    // question with no read-buffer lock (just the 150ms invisible guardrail).
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
    }, 1000);
  }

  function finishGame() {
    if (timerRef.current)  clearInterval(timerRef.current);
    if (nextRef.current)   clearTimeout(nextRef.current);
    if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    const final = scoreRef.current;
    // Bot ghost score was pre-generated at match start (300–3,000, independent
    // of player score — mothership v1.23 bot-ghost rule). Just reveal it now.
    setGhostScore(ghost.score);
    setGameEmotes(pickInterviewEmotes());
    updateHighScore('quickmatch', final);
    setPhase('result');
  }

  // ── Lock-on-exit (anti-cheat) ──────────────────────────────────────────────
  // Per mothership Part 3: NAVIGATION away from the playing screen (hardware
  // back, iOS swipe-back, programmatic nav) locks the score and ends the round.
  // BACKGROUNDING (notification, Control Center, phone call, app switch) does
  // NOT lock — the timer keeps running on wall-clock time, the player loses
  // time but can resume. Force-quit captures the latest persisted score (high
  // score updated progressively in handleAnswer below).
  function lockScoreOnExit() {
    if (phase !== 'playing') return;       // pre-game / post-game phases skip
    if (timerRef.current)     clearInterval(timerRef.current);
    if (nextRef.current)      clearTimeout(nextRef.current);
    if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    updateHighScore('quickmatch', scoreRef.current);
  }

  // On foreground after any background/inactive transition, immediately
  // recompute timeLeft from wall-clock so the UI snaps to the correct
  // value (the interval would otherwise take up to 1s to catch up).
  // No more "elapsed" subtraction — wall-clock math handles it intrinsically.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (phase !== 'playing' || roundStartRef.current === null) return;
      if (state === 'active') {
        const elapsed = Math.floor((Date.now() - roundStartRef.current) / 1000);
        setTimeLeft(Math.max(0, 60 - elapsed));
      }
    });
    return () => sub.remove();
  }, [phase]);

  // Navigation away (hardware back, iOS swipe back, programmatic nav)
  useFocusEffect(
    useCallback(() => {
      return () => lockScoreOnExit();
    }, [phase])
  );

  const multiplier = getMultiplier(displayStreak);

  function getBtnState(i: number): BtnState {
    if (!isAnswered) return 'idle';
    if (i === question.correct) return 'correct';
    if (i === selectedAnswer)   return 'wrong';
    return 'dim';
  }

  // ── Matching ────────────────────────────────────────────────────────────────
  if (phase === 'matching') {
    return (
      <View style={s.centered}>
        <ActivityIndicator size="large" color={Colors.red} />
        <Text style={s.matchingTitle}>FINDING YOUR GHOST</Text>
        <Text style={s.matchingSub}>searching the pool...</Text>
      </View>
    );
  }

  // ── Preview ─────────────────────────────────────────────────────────────────
  if (phase === 'preview') {
    return (
      <View style={s.centered}>
        <Text style={s.vsLabel}>YOUR OPPONENT</Text>
        <View style={s.avatarWrap}>
          <View style={s.avatarShadow} />
          <View style={s.avatarFace}>
            <Avatar color={ghost.color} eyes={ghost.eyes} mouth={ghost.mouth} size={96} />
          </View>
        </View>
        <Text style={s.ghostName}>{ghost.name}</Text>
        <Text style={s.ghostTime}>{ghost.time}</Text>
        <Text style={s.ghostEmote}>{ghost.emote}</Text>
        <Pressable style={s.startBtn} onPress={() => setPhase('playing')}>
          <View style={s.startBtnShadow} />
          <View style={s.startBtnFace}>
            <Text style={s.startBtnText}>START RACE</Text>
          </View>
        </Pressable>
      </View>
    );
  }

  // Resolve the emote the player leaves behind: their pick, or a random one if they skipped.
  function resolveEmote(): string {
    if (selectedEmote) return selectedEmote;
    const pool = EMOTES.filter(e => e.active);
    return pool[Math.floor(Math.random() * pool.length)].text;
  }

  // ── Result ──────────────────────────────────────────────────────────────────
  if (phase === 'result') {
    const final = scoreRef.current;
    const won   = final > ghostScore;
    const tied  = final === ghostScore;
    const headline = tied ? "IT'S A TIE" : won ? '🏆 YOU WIN' : '👻 GHOST WINS';
    return (
      <View style={s.centered}>
        <Text style={s.resultTitle}>{headline}</Text>
        <View style={s.scoreReveal}>
          <View style={s.scoreCard}>
            <Text style={s.scoreCardLabel}>You</Text>
            <Text style={[s.scoreValue, won && s.winnerScore]}>{final.toLocaleString()}</Text>
            <Text style={s.scoreRank}>{getRankLabel(final)}</Text>
          </View>
          <Text style={s.vsText}>VS</Text>
          <View style={s.scoreCard}>
            <Avatar color={ghost.color} eyes={ghost.eyes} mouth={ghost.mouth} size={40} />
            <Text style={s.scoreCardLabel}>{ghost.name}</Text>
            <Text style={[s.scoreValue, !won && !tied && s.winnerScore]}>{ghostScore.toLocaleString()}</Text>
            <Text style={s.scoreRank}>{getRankLabel(ghostScore)}</Text>
          </View>
        </View>

        <Text style={s.interviewLabel}>POST-GAME INTERVIEW</Text>
        <View style={s.emoteRow}>
          {gameEmotes.map(e => {
            const isSelected = selectedEmote === e;
            const isDimmed   = selectedEmote !== null && !isSelected;
            return (
              <Pressable
                key={e}
                style={[s.emoteChip, isSelected && s.emoteChipSelected, isDimmed && s.emoteChipDim]}
                onPress={() => setSelectedEmote(isSelected ? null : e)}
              >
                <Text style={[s.emoteText, isSelected && s.emoteTextSelected]}>{e}</Text>
              </Pressable>
            );
          })}
        </View>
        <Pressable onPress={() => { resolveEmote(); router.replace('/echo'); }}>
          <View style={s.newGhostWrap}>
            <View style={s.newGhostShadow} />
            <View style={s.newGhostFace}>
              <Text style={s.newGhostText}>NEW GHOST</Text>
            </View>
          </View>
        </Pressable>
        <Pressable onPress={() => { resolveEmote(); router.replace('/'); }} style={s.homeLink}>
          <Text style={s.homeLinkText}>go home</Text>
        </Pressable>
      </View>
    );
  }

  // ── Playing ─────────────────────────────────────────────────────────────────
  const timerColor = timeLeft <= 10 ? Colors.red : timeLeft <= 20 ? '#f59e0b' : Colors.ink;
  const flashBg    = isAnswered
    ? (selectedAnswer === question?.correct ? '#d1fae5' : '#fee2e2')
    : Colors.cream;

  return (
    <View style={[play.container, { backgroundColor: flashBg }]}>

      {/* ── Header ── */}
      <View style={play.header}>

        {/* Timer */}
        <View style={play.timerWrap}>
          <Text style={[play.timer, { color: timerColor }]}>{timeLeft}</Text>
          <Text style={[play.timerUnit, { color: timerColor }]}>s</Text>
        </View>

        {/* Ghost mini */}
        <View style={play.ghostMini}>
          <Avatar color={ghost.color} eyes={ghost.eyes} mouth={ghost.mouth} size={28} />
          <Text style={play.ghostMiniName} numberOfLines={1}>{ghost.name}</Text>
        </View>

        {/* Score + multiplier */}
        <View style={play.scoreWrap}>
          {multiplier > 1 && (
            <View style={play.multPill}>
              <Text style={play.multText}>{multiplier}×</Text>
            </View>
          )}
          <Text style={play.score}>{displayScore.toLocaleString()}</Text>
        </View>

      </View>

      {/* Divider */}
      <View style={play.divider} />

      {/* ── Status strips ── */}
      {displayStreak >= 3 && (
        <Text style={play.streakLabel}>🔥 {displayStreak} streak</Text>
      )}
      {displayMiss >= 2 && (
        <Text style={play.missLabel}>⚠️ {displayMiss} / 3 misses</Text>
      )}

      {/* ── Question ── */}
      <View style={play.questionZone}>
        <Text style={play.qNumber}>Q {questionIndex + 1}</Text>
        <Text style={play.question}>{question.question}</Text>
      </View>

      {/* ── Points flash ── */}
      {isAnswered && lastPoints !== null && (
        <View style={play.flashWrap}>
          <Text style={[play.pointsFlash, lastPoints < 0 && play.pointsNeg]}>
            {lastPoints > 0 ? `+${lastPoints}` : `${lastPoints}`}
          </Text>
          {lastLabel ? (
            <Text style={play.bonusLabel}>{lastLabel}</Text>
          ) : null}
        </View>
      )}

      {/* ── Answer buttons ── */}
      <View style={play.answers}>
        {question.options.map((option, i) => (
          <AnswerButton
            key={i}
            option={option}
            onPress={() => handleAnswer(i)}
            state={getBtnState(i)}
          />
        ))}
      </View>

    </View>
  );
}

// ─── Shared / non-playing styles ─────────────────────────────────────────────

const s = StyleSheet.create({
  centered:       { flex: 1, backgroundColor: Colors.cream, alignItems: 'center', justifyContent: 'center', padding: 28, gap: 10 },

  // Matching
  matchingTitle:  { fontFamily: Fonts.black, fontSize: 16, color: Colors.ink, letterSpacing: 1, marginTop: 16 },
  matchingSub:    { fontFamily: Fonts.mono, fontSize: 12, color: Colors.ink, opacity: 0.4, letterSpacing: 0.5 },

  // Preview
  vsLabel:        { fontFamily: Fonts.mono, fontSize: 11, color: Colors.ink, opacity: 0.5, letterSpacing: 2, textTransform: 'uppercase' },
  avatarWrap:     { position: 'relative', width: 112, height: 112 + CARD_DEPTH, marginVertical: 8 },
  avatarShadow:   { position: 'absolute', left: 0, right: 0, top: CARD_DEPTH, height: 112, backgroundColor: Colors.ink, borderRadius: 56 },
  avatarFace:     { position: 'absolute', left: 0, right: 0, top: 0, height: 112, borderRadius: 56, borderWidth: 3, borderColor: Colors.ink, backgroundColor: Colors.cream, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  ghostName:      { fontFamily: Fonts.black, fontSize: 22, color: Colors.ink, marginTop: 4 },
  ghostTime:      { fontFamily: Fonts.mono, fontSize: 12, color: Colors.ink, opacity: 0.45 },
  ghostEmote:     { fontFamily: Fonts.mono, fontSize: 14, color: Colors.ink, opacity: 0.7, fontStyle: 'italic', marginBottom: 12, textAlign: 'center' },
  startBtn:       { width: '100%' },
  startBtnWrap:   { position: 'relative', height: 56 + CARD_DEPTH },
  startBtnShadow: { position: 'absolute', left: 0, right: 0, top: CARD_DEPTH, height: 56, backgroundColor: Colors.ink, borderRadius: Radius.sm },
  startBtnFace:   { position: 'relative', height: 56, backgroundColor: Colors.red, borderRadius: Radius.sm, borderWidth: 3, borderColor: Colors.ink, alignItems: 'center', justifyContent: 'center' },
  startBtnText:   { fontFamily: Fonts.black, fontSize: 18, color: Colors.cream, letterSpacing: 1 },

  // Result
  resultTitle:    { fontFamily: Fonts.black, fontSize: 30, color: Colors.ink, letterSpacing: -0.5 },
  scoreReveal:    { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: Colors.cream, borderRadius: Radius.card, borderWidth: 3, borderColor: Colors.ink, padding: 20, marginVertical: 12, width: '100%' },
  scoreCard:      { alignItems: 'center', gap: 4, flex: 1 },
  vsText:         { fontFamily: Fonts.black, fontSize: 16, color: Colors.ink, opacity: 0.3 },
  scoreCardLabel: { fontFamily: Fonts.mono, fontSize: 11, color: Colors.ink, opacity: 0.5, textTransform: 'uppercase', letterSpacing: 1 },
  scoreValue:     { fontFamily: Fonts.black, fontSize: 34, color: Colors.ink },
  winnerScore:    { color: Colors.red },
  scoreRank:      { fontFamily: Fonts.mono, fontSize: 11, color: Colors.ink, opacity: 0.45 },
  interviewLabel: { fontFamily: Fonts.mono, fontSize: 10, color: Colors.ink, opacity: 0.4, letterSpacing: 2, textTransform: 'uppercase', marginTop: 8, marginBottom: 2 },
  emoteRow:       { flexDirection: 'column', gap: 8, width: '100%' },
  emoteChip:        { backgroundColor: Colors.cream, paddingVertical: 10, paddingHorizontal: 16, borderRadius: Radius.sm, borderWidth: 3, borderColor: Colors.ink },
  emoteChipSelected:{ backgroundColor: Colors.yellow },
  emoteChipDim:     { opacity: 0.3 },
  emoteText:        { fontFamily: Fonts.mono, fontSize: 13, color: Colors.ink, textAlign: 'center' },
  emoteTextSelected:{ color: Colors.ink },
  homeLink:         { paddingVertical: 10 },
  homeLinkText:     { fontFamily: Fonts.mono, fontSize: 13, color: Colors.ink, opacity: 0.4, textDecorationLine: 'underline' },
  newGhostWrap:   { position: 'relative', height: 52 + CARD_DEPTH, width: 220, marginTop: 4 },
  newGhostShadow: { position: 'absolute', left: 0, right: 0, top: CARD_DEPTH, height: 52, backgroundColor: Colors.ink, borderRadius: Radius.sm },
  newGhostFace:   { position: 'absolute', left: 0, right: 0, top: 0, height: 52, backgroundColor: Colors.yellow, borderRadius: Radius.sm, borderWidth: 3, borderColor: Colors.ink, alignItems: 'center', justifyContent: 'center' },
  newGhostText:   { fontFamily: Fonts.black, fontSize: 16, color: Colors.ink, letterSpacing: 0.5 },
});

// ─── Playing styles ───────────────────────────────────────────────────────────

const play = StyleSheet.create({
  container:   { flex: 1, paddingHorizontal: 20, paddingTop: 56 },

  // Header
  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  timerWrap:   { flexDirection: 'row', alignItems: 'baseline', minWidth: 60 },
  timer:       { fontFamily: Fonts.black, fontSize: 34, lineHeight: 38 },
  timerUnit:   { fontFamily: Fonts.mono, fontSize: 14, marginLeft: 2, opacity: 0.6 },
  ghostMini:   { alignItems: 'center', gap: 4 },
  ghostMiniName: { fontFamily: Fonts.mono, fontSize: 10, color: Colors.ink, opacity: 0.5, letterSpacing: 0.3, maxWidth: 90 },
  scoreWrap:   { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'flex-end', minWidth: 80 },
  multPill:    { backgroundColor: Colors.yellow, paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.pill, borderWidth: 2, borderColor: Colors.ink },
  multText:    { fontFamily: Fonts.black, fontSize: 13, color: Colors.ink },
  score:       { fontFamily: Fonts.black, fontSize: 22, color: Colors.ink },

  divider:     { height: 2, backgroundColor: Colors.ink, opacity: 0.08, marginBottom: 12 },

  // Status
  streakLabel: { fontFamily: Fonts.black, fontSize: 13, color: '#ea580c', marginBottom: 4, letterSpacing: 0.3 },
  missLabel:   { fontFamily: Fonts.mono, fontSize: 12, color: Colors.red, marginBottom: 4, fontWeight: '700' },

  // Question
  questionZone:{ flex: 1, justifyContent: 'center', paddingBottom: 4 },
  qNumber:     { fontFamily: Fonts.mono, fontSize: 11, color: Colors.ink, opacity: 0.35, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 },
  question:    { fontFamily: Fonts.black, fontSize: 28, color: Colors.ink, lineHeight: 36, letterSpacing: -0.5 },

  // Points flash
  flashWrap:   { alignItems: 'center', marginBottom: 10 },
  pointsFlash: { fontFamily: Fonts.black, fontSize: 30, color: '#16a34a', letterSpacing: -1 },
  pointsNeg:   { color: Colors.red },
  bonusLabel:  { fontFamily: Fonts.mono, fontSize: 10, color: '#16a34a', letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 3 },

  // Answers
  answers:     { gap: 10, paddingBottom: 32 },
});
