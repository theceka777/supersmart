// components/round/RoundLayoutA.tsx
// "Top-down stadium" — the only locked layout in the v2 handoff.
//
// Stack (bottom → top, z-index ordered):
//   1. cream stage background
//   2. RoundSunburst       — tier-driven speed/opacity
//   3. OutsideInPulse      — tier-colored vignette pulse (off at tier 0)
//   4. HalftoneOverlay     — pulsing dot grid, tier-driven
//   5. EdgeGlow            — single-shot flash on correct/wrong
//   6. VS strip + HUD      — YOU / VsBadge / OPPONENT, timer + streak chip
//   7. QuestionCard        — bordered hero card, fades in per question
//   8. AnswerButtons       — 3 stacked, idle/correct/wrong/dim states
//   9. FullscreenLightning — sub-2s celebration burst
//  10. FeedbackPopup       — points / penalty / wrong-answer-reveal popup
//  11. Nudge (speed + streak) — first-time onboarding pulses
//  12. UnstoppableBanner   — 10-streak banner
//
// The state machine + scoring still live in `app/echo.tsx` / `app/daily.tsx`.
// This component is purely the visual layer — receives state via props and
// fires `onPick(index)` back up when an answer is tapped.

import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, StreakTier } from '@/constants/theme';
import {
  ROUND_DURATION_SEC,
  streakMultiplier,
  streakTier,
  type StreakTierLevel,
} from './constants';
import { RoundSunburst } from './RoundSunburst';
import { OutsideInPulse } from './OutsideInPulse';
import { HalftoneOverlay } from './HalftoneOverlay';
import { EdgeGlow } from './EdgeGlow';
import { PlayerBlock } from './PlayerBlock';
import { VsBadge } from './VsBadge';
import { TimerPill } from './TimerPill';
import { StreakChip } from './StreakChip';
import { QuestionCard, QuestionCardVariant } from './QuestionCard';
import { AnswerButton, AnswerButtonState } from './AnswerButton';
import { FeedbackPopup, Feedback } from './FeedbackPopup';
import { Nudge } from './Nudge';
import { UnstoppableBanner } from './UnstoppableBanner';
import { FullscreenLightning } from './FullscreenLightning';
import type { BrainExpression } from '@/components/Brain';

export type RoundMode = 'quickmatch' | 'dailyrace';

export interface RoundLayoutAProps {
  /** Question being shown. */
  q: { q: string; a: string[]; c: number };
  /** Question index (0-based). Drives the card's fade-in re-trigger. */
  qIdx: number;
  /** Player's running score. */
  score: number;
  /** Current correct-answer streak count. */
  streak: number;
  /** Seconds remaining (float — caller passes wall-clock-derived value). */
  timeLeft: number;

  /** Index of the answer the player just picked, or null during idle. */
  picked: number | null;
  /** True if the picked answer was correct. */
  pickedCorrect: boolean | null;

  /** Feedback popup data — re-keyed per fire. */
  feedback: Feedback | null;
  /** Brain mascot expression. Caller flips to 'hype' on rare correct answers. */
  brainExpr: BrainExpression;

  /** Edge-glow flash kind + key (incremented per fire). */
  flashKind: 'correct' | 'wrong' | null;
  flashKey: number;

  /** UNSTOPPABLE banner state — set on streak hitting 10. */
  unstoppableActive: boolean;
  unstoppableKey: number;

  /** Sub-2s lightning fire key. undefined = don't render. */
  lightningKey?: number;

  /** First-time onboarding nudges. */
  showSpeedNudge: string | null;   // null or label text
  speedNudgeKey: number;
  showStreakNudge: boolean;
  streakNudgeKey: number;

  /** Theme — quickmatch (pink) or dailyrace (cyan). Drives card + timer color. */
  mode: RoundMode;

  /** Optional override — overrides the mode-derived timer color. */
  timerColor?: string;

  /** Opponent display name + initial. */
  opponentName?: string;
  opponentInitial?: string;

  /** Called when an idle answer button is tapped. */
  onPick: (idx: number) => void;
}

// Mode → card variant + default timer color
const MODE_CARD: Record<RoundMode, QuestionCardVariant> = {
  quickmatch: 'pink',
  dailyrace:  'cyan',
};
const MODE_TIMER: Record<RoundMode, string> = {
  quickmatch: Colors.pink,
  dailyrace:  Colors.dailyrace.bg,
};

export function RoundLayoutA(props: RoundLayoutAProps) {
  const {
    q, qIdx, score, streak, timeLeft,
    picked, pickedCorrect,
    feedback, brainExpr,
    flashKind, flashKey,
    unstoppableActive, unstoppableKey,
    lightningKey,
    showSpeedNudge, speedNudgeKey,
    showStreakNudge, streakNudgeKey,
    mode,
    timerColor,
    opponentName = 'ECHO·47',
    opponentInitial = 'E',
    onPick,
  } = props;

  const { width: screenW, height: screenH } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const tier: StreakTierLevel = streakTier(streak);
  const mult = streakMultiplier(streak);

  // Sunburst speed + opacity ramp by tier
  const burstSpeed = StreakTier.burstSpeedSec[tier];
  const burstOpacity = StreakTier.burstOpacity[tier];

  // Opponent score uses the same fake-math the design ships — wired to real
  // opponent data in Phase 4. Slow drift via qIdx so it ticks during the round.
  const oppScore = Math.round(score * 0.82 + qIdx * 18);

  // Top-anchor offsets relative to safe area. Numbers below match the design's
  // absolute top values (56 / 148 / 240) but expressed relative to the safe-area
  // top so notched devices and non-notched devices both look right.
  const TOP_VS = Math.max(insets.top + 12, 56);
  const TOP_TIMER = TOP_VS + 92;
  const TOP_QUESTION = TOP_TIMER + 92;

  const resolvedTimerColor = timerColor ?? MODE_TIMER[mode];
  const cardVariant = MODE_CARD[mode];

  return (
    <View style={[styles.stage, { width: screenW, height: screenH }]}>
      {/* 1. cream stage backdrop — explicit, in case the parent didn't set one */}
      <View style={[styles.cream, { backgroundColor: Colors.cream }]} pointerEvents="none" />

      {/* 2. sunburst */}
      <RoundSunburst speedSec={burstSpeed} opacity={burstOpacity} />

      {/* 3. outside-in pulse */}
      <OutsideInPulse tier={tier} width={screenW} height={screenH} />

      {/* 4. halftone overlay */}
      <HalftoneOverlay tier={tier} width={screenW} height={screenH} />

      {/* 5. edge glow flash */}
      <EdgeGlow kind={flashKind} tier={tier} fireKey={flashKey} width={screenW} height={screenH} />

      {/* 6. VS strip */}
      <View style={[styles.vsStrip, { top: TOP_VS }]}>
        <PlayerBlock
          side="you"
          name="YOU"
          score={score}
          tier={tier}
          brainExpr={brainExpr}
        />
        <VsBadge tier={tier} />
        <PlayerBlock
          side="opp"
          name={opponentName}
          score={oppScore}
          oppInitial={opponentInitial}
        />
      </View>

      {/* 7. timer + streak chip */}
      <View style={[styles.timerStack, { top: TOP_TIMER }]}>
        <TimerPill timeLeft={timeLeft} color={resolvedTimerColor} />
        {streak >= 3 && (
          <View style={styles.streakChipWrap}>
            <StreakChip streak={streak} tier={tier} />
          </View>
        )}
      </View>

      {/* 8. question card */}
      <View style={[styles.questionWrap, { top: TOP_QUESTION }]}>
        <QuestionCard
          key={`q-${qIdx}`}
          question={q.q}
          qIdx={qIdx}
          variant={cardVariant}
        />
      </View>

      {/* 9. 3 answer buttons */}
      <View style={[styles.buttons, { bottom: Math.max(insets.bottom, 0) + 90 }]}>
        {q.a.map((label, i) => {
          let state: AnswerButtonState = null;
          if (picked !== null) {
            if (i === picked) state = pickedCorrect ? 'correct' : 'wrong';
            else if (!pickedCorrect && i === q.c) state = 'correct';
            else state = 'dim';
          }
          return (
            <AnswerButton
              key={`${qIdx}-${i}`}
              label={label}
              state={state}
              hypeLevel={tier}
              onPress={() => onPick(i)}
            />
          );
        })}
      </View>

      {/* 10. fullscreen lightning on sub-2s correct */}
      <FullscreenLightning fireKey={lightningKey} />

      {/* 11. feedback popup */}
      <FeedbackPopup feedback={feedback} />

      {/* 12. onboarding nudges */}
      <Nudge text={showSpeedNudge} color={Colors.yellow} fireKey={speedNudgeKey} />
      <Nudge text={showStreakNudge ? '3 in a row — 2×!' : null} color={StreakTier.colors[1] ?? Colors.yellow} fireKey={streakNudgeKey} />

      {/* 13. UNSTOPPABLE banner */}
      <UnstoppableBanner active={unstoppableActive} fireKey={unstoppableKey} />
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    position: 'absolute',
    top: 0, left: 0,
    overflow: 'hidden',
  },
  cream: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  vsStrip: {
    position: 'absolute',
    left: 0, right: 0,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    zIndex: 30,
  },
  timerStack: {
    position: 'absolute',
    left: 0, right: 0,
    alignItems: 'center',
    gap: 6,
    zIndex: 30,
  },
  streakChipWrap: {
    transform: [{ scale: 0.78 }],
  },
  questionWrap: {
    position: 'absolute',
    left: 24, right: 24,
    zIndex: 20,
  },
  buttons: {
    position: 'absolute',
    left: 24, right: 24,
    flexDirection: 'column',
    gap: 14,
    zIndex: 20,
  },
});
