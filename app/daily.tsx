import { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { QUESTIONS, Question } from './questions';
import { useAppStore } from './store';

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
  // Shuffle question order with seeded RNG
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  // Shuffle options within each question (seeded so all players see same order)
  return arr.slice(0, 10).map(q => {
    const correctText = q.options[q.correct];
    const opts = [...q.options] as [string, string, string];
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    return { ...q, options: opts, correct: opts.indexOf(correctText) };
  });
}

export default function DailyScreen() {
  const router = useRouter();
  const { dailyStatus, setDailyPlayed } = useAppStore();
  const today = new Date().toISOString().split('T')[0];
  const alreadyPlayed = dailyStatus.date === today && dailyStatus.played;

  const [questions] = useState(getDailyQuestions);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const nextRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const question = questions[questionIndex];
  const isAnswered = selectedAnswer !== null;

  function startTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(10);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          submitAnswer(-1);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  useEffect(() => {
    if (!alreadyPlayed) startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (nextRef.current) clearTimeout(nextRef.current);
    };
  }, [questionIndex]);

  function submitAnswer(index: number) {
    if (isAnswered || alreadyPlayed) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setSelectedAnswer(index);
    const isCorrect = index === question.correct;
    const newScore = isCorrect ? score + 100 : score;
    const newResults = [...results, isCorrect];
    if (isCorrect) setScore(newScore);

    nextRef.current = setTimeout(() => {
      if (newResults.length === 10) {
        setDailyPlayed(newScore, newResults);
        const encoded = newResults.map(r => (r ? '1' : '0')).join('');
        router.replace(`/end?score=${newScore}&mode=daily&results=${encoded}`);
      } else {
        setQuestionIndex(i => i + 1);
        setSelectedAnswer(null);
      }
    }, 900);
  }

  function getButtonStyle(index: number) {
    if (!isAnswered) return styles.answerButton;
    if (index === question.correct) return [styles.answerButton, styles.correct];
    if (index === selectedAnswer) return [styles.answerButton, styles.wrong];
    return [styles.answerButton, styles.dim];
  }

  const timerColor = timeLeft <= 3 ? '#dc2626' : timeLeft <= 5 ? '#f59e0b' : '#111827';

  // Already played
  if (alreadyPlayed) {
    const correct = dailyStatus.results.filter(Boolean).length;
    const grid = dailyStatus.results.map(r => (r ? '🟩' : '🟥')).join('');
    return (
      <View style={styles.container}>
        <Text style={styles.title}>DAILY QUIZ</Text>
        <Text style={styles.alreadyLabel}>Already played today</Text>
        <Text style={styles.alreadyScore}>{correct}/10</Text>
        <Text style={styles.grid}>{grid}</Text>
        <View style={styles.shareBox}>
          <Text style={styles.shareText}>Super Smart Daily — {correct}/10{'\n'}{grid}</Text>
        </View>
        <Text style={styles.comeBack}>New quiz resets at midnight.</Text>
      </View>
    );
  }

  // Guard: during the brief window between index update and router.replace, question may be undefined
  if (!question) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>DAILY QUIZ</Text>
        <Text style={[styles.timer, { color: timerColor }]}>{timeLeft}s</Text>
      </View>

      <View style={styles.progressRow}>
        {Array.from({ length: 10 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i < results.length
                ? results[i] ? styles.dotGreen : styles.dotRed
                : i === questionIndex ? styles.dotActive : styles.dotEmpty,
            ]}
          />
        ))}
      </View>

      <Text style={styles.questionNum}>Question {questionIndex + 1} of 10</Text>
      <Text style={styles.question}>{question.question}</Text>

      <View style={styles.answers}>
        {question.options.map((option, i) => (
          <TouchableOpacity
            key={i}
            style={getButtonStyle(i)}
            onPress={() => submitAnswer(i)}
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '900', color: '#dc2626', letterSpacing: 1 },
  timer: { fontSize: 24, fontWeight: '800' },
  progressRow: { flexDirection: 'row', gap: 6, marginBottom: 24 },
  dot: { flex: 1, height: 8, borderRadius: 4 },
  dotEmpty: { backgroundColor: '#e5e7eb' },
  dotActive: { backgroundColor: '#fbbf24' },
  dotGreen: { backgroundColor: '#16a34a' },
  dotRed: { backgroundColor: '#dc2626' },
  questionNum: { fontSize: 13, color: '#9ca3af', fontWeight: '600', marginBottom: 8 },
  question: { fontSize: 26, fontWeight: '600', color: '#111827', marginBottom: 32, lineHeight: 34 },
  answers: { gap: 12 },
  answerButton: { backgroundColor: '#f3f4f6', padding: 18, borderRadius: 12 },
  correct: { backgroundColor: '#16a34a' },
  wrong: { backgroundColor: '#dc2626' },
  dim: { opacity: 0.5 },
  answerText: { fontSize: 18, fontWeight: '500', color: '#111827', textAlign: 'center' },
  alreadyLabel: { fontSize: 18, color: '#6b7280', marginTop: 24 },
  alreadyScore: { fontSize: 80, fontWeight: '900', color: '#dc2626' },
  grid: { fontSize: 28, letterSpacing: 4 },
  shareBox: { backgroundColor: '#f9fafb', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  shareText: { fontSize: 16, color: '#374151', fontWeight: '600', textAlign: 'center', lineHeight: 28 },
  comeBack: { fontSize: 14, color: '#9ca3af', marginTop: 12 },
});
