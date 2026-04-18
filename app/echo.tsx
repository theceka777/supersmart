import { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { QUESTIONS, shuffleQuestions, getRank } from './questions';
import { Avatar } from '@/components/Avatar';
import { useAppStore } from './store';

const GHOST_NAMES = ['QuizWizard_88', 'GhostPlayer_42', 'BrainFuel_77', 'TriviaTank_99', 'SmartBomb_11'];
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

export default function EchoScreen() {
  const router = useRouter();
  const { updateHighScore } = useAppStore();
  const [phase, setPhase] = useState<'matching' | 'preview' | 'playing' | 'result'>('matching');
  const [questions] = useState(() => shuffleQuestions(QUESTIONS));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [ghostScore, setGhostScore] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const nextRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [ghost] = useState({
    name: pick(GHOST_NAMES),
    color: pick(GHOST_COLORS),
    emote: pick(GHOST_EMOTES),
    time: pick(GHOST_TIMES),
  });

  const question = questions[questionIndex];
  const isAnswered = selectedAnswer !== null;

  // Matching → preview after 1.5s
  useEffect(() => {
    if (phase !== 'matching') return;
    const t = setTimeout(() => setPhase('preview'), 1500);
    return () => clearTimeout(t);
  }, [phase]);

  // Playing timer
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
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  function handleAnswer(index: number) {
    if (isAnswered) return;
    setSelectedAnswer(index);
    const isCorrect = index === question.correct;
    const newScore = isCorrect ? score + 100 : score;
    if (isCorrect) setScore(newScore);

    nextRef.current = setTimeout(() => {
      if (questionIndex + 1 >= questions.length) {
        finishGame();
      } else {
        setQuestionIndex(i => i + 1);
        setSelectedAnswer(null);
      }
    }, isCorrect ? 400 : 1000);
  }

  function finishGame() {
    if (timerRef.current) clearInterval(timerRef.current);
    if (nextRef.current) clearTimeout(nextRef.current);
    // Ghost score: close to player with some randomness
    const base = Math.max(score, 300);
    const swing = Math.floor(base * 0.35 * (Math.random() - 0.4));
    const fake = Math.max(0, base + swing);
    setGhostScore(fake);
    updateHighScore('arcade', score);
    setPhase('result');
  }

  function getButtonStyle(index: number) {
    if (!isAnswered) return styles.answerButton;
    if (index === question.correct) return [styles.answerButton, styles.correct];
    if (index === selectedAnswer) return [styles.answerButton, styles.wrong];
    return [styles.answerButton, styles.dim];
  }

  // Matching
  if (phase === 'matching') {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#dc2626" />
        <Text style={styles.matchingText}>Finding your ghost...</Text>
      </View>
    );
  }

  // Preview
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

  // Result
  if (phase === 'result') {
    const won = score > ghostScore;
    const tied = score === ghostScore;
    const headline = tied ? "IT'S A TIE" : won ? '🏆 YOU WIN' : '👻 GHOST WINS';
    return (
      <View style={styles.centered}>
        <Text style={styles.resultTitle}>{headline}</Text>
        <View style={styles.scoreReveal}>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreCardLabel}>You</Text>
            <Text style={[styles.scoreValue, won && styles.winnerScore]}>{score}</Text>
            <Text style={styles.scoreRank}>{getRank(score)}</Text>
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
        <TouchableOpacity style={styles.startButton} onPress={() => router.replace('/multiplayer')}>
          <Text style={styles.startButtonText}>NEW GHOST</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Playing
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.timerText}>⏱ {timeLeft}s</Text>
        <View style={styles.ghostMini}>
          <Avatar color={ghost.color} eyes="square" mouth="smirk" size={30} />
          <Text style={styles.ghostMiniName}>{ghost.name}</Text>
        </View>
        <Text style={styles.scoreText}>{score}</Text>
      </View>

      <Text style={styles.question}>{question.question}</Text>

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
  container: { flex: 1, backgroundColor: '#fff', padding: 24, paddingTop: 60 },
  centered: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  matchingText: { fontSize: 18, color: '#6b7280', marginTop: 16 },
  vsLabel: { fontSize: 13, fontWeight: '700', color: '#9ca3af', letterSpacing: 2 },
  ghostName: { fontSize: 26, fontWeight: '800', color: '#111827', marginTop: 8 },
  ghostTime: { fontSize: 14, color: '#9ca3af' },
  ghostEmote: { fontSize: 16, color: '#6b7280', fontStyle: 'italic', marginBottom: 16 },
  startButton: { backgroundColor: '#dc2626', paddingVertical: 16, paddingHorizontal: 48, borderRadius: 14, marginTop: 8 },
  startButtonText: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  timerText: { fontSize: 20, fontWeight: '800', color: '#111827' },
  ghostMini: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ghostMiniName: { fontSize: 13, color: '#6b7280', fontWeight: '600' },
  scoreText: { fontSize: 20, fontWeight: '800', color: '#111827' },
  question: { fontSize: 26, fontWeight: '600', color: '#111827', marginBottom: 32, lineHeight: 34 },
  answers: { gap: 12 },
  answerButton: { backgroundColor: '#f3f4f6', padding: 18, borderRadius: 12 },
  correct: { backgroundColor: '#16a34a' },
  wrong: { backgroundColor: '#dc2626' },
  dim: { opacity: 0.5 },
  answerText: { fontSize: 18, fontWeight: '500', color: '#111827', textAlign: 'center' },
  resultTitle: { fontSize: 32, fontWeight: '900', color: '#111827' },
  scoreReveal: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: '#f9fafb', borderRadius: 16, padding: 20, marginVertical: 16 },
  scoreCard: { alignItems: 'center', gap: 4, flex: 1 },
  vsText: { fontSize: 18, fontWeight: '800', color: '#9ca3af' },
  scoreCardLabel: { fontSize: 13, fontWeight: '600', color: '#6b7280' },
  scoreValue: { fontSize: 36, fontWeight: '900', color: '#111827' },
  winnerScore: { color: '#dc2626' },
  scoreRank: { fontSize: 12, color: '#9ca3af' },
  emotePrompt: { fontSize: 16, color: '#374151', fontWeight: '600' },
  emoteRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' },
  emoteChip: { backgroundColor: '#f3f4f6', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 20 },
  emoteText: { fontSize: 13, color: '#374151' },
});
