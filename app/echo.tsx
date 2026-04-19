// echo.tsx — Quickmatch (ghost race) mode
// Playing-phase redesign: Cream Stadium aesthetic, ArcadeCard-style answer buttons.
// All game logic unchanged — only JSX + styles updated.

import { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
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

const GHOST_NAMES  = ['QuizWizard_88', 'GhostPlayer_42', 'BrainFuel_77', 'TriviaTank_99', 'SmartBomb_11'];
const GHOST_COLORS = ['#6B9DFF', '#FF6B9D', '#6BDB6B', '#FFB86B', '#B86BFF'];
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

const FREE_LIMIT     = 7;
const LOCK_MS        = 1000;
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
    emote: pickGhostEmote(),
    time:  pick(GHOST_TIMES),
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
  const [locked,         setLocked]         = useState(true);
  const [gameEmotes,     setGameEmotes]     = useState<string[]>([]);
  const [selectedEmote,  setSelectedEmote]  = useState<string | null>(null);

  const timerRef     = useRef<ReturnType<typeof setInterval> | null>(null);
  const nextRef      = useRef<ReturnType<typeof setTimeout>  | null>(null);
  const lockTimerRef = useRef<ReturnType<typeof setTimeout>  | null>(null);

  const question   = questions[questionIndex];
  const isAnswered = selectedAnswer !== null;

  // Matching → preview
  useEffect(() => {
    if (phase !== 'matching') return;
    const t = setTimeout(() => setPhase('preview'), 1500);
    return () => clearTimeout(t);
  }, [phase]);

  // 60-second countdown
  useEffect(() => {
    if (phase !== 'playing') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current!); finishGame(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current)     clearInterval(timerRef.current);
      if (nextRef.current)      clearTimeout(nextRef.current);
      if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    };
  }, [phase]);

  // 1-second UI lock per question
  useEffect(() => {
    if (phase !== 'playing') return;
    canAnswerRef.current = false;
    setLocked(true);
    lockTimerRef.current = setTimeout(() => {
      questionStartRef.current = Date.now();
      canAnswerRef.current = true;
      setLocked(false);
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
    setGameEmotes(pickInterviewEmotes());
    updateHighScore('quickmatch', final);
    setPhase('result');
  }

  const multiplier = getMultiplier(displayStreak);

  function getBtnState(i: number): BtnState {
    if (!isAnswered) return locked ? 'locked' : 'idle';
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
            <Avatar color={ghost.color} eyes="square" mouth="smirk" size={96} />
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
            <Avatar color={ghost.color} eyes="square" mouth="smirk" size={40} />
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
          <Avatar color={ghost.color} eyes="square" mouth="smirk" size={28} />
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
