import { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { QUESTIONS, shuffleQuestions } from './questions';
import { useAppStore } from './store';

const MAX_STRIKES = 3;
const QUESTION_TIME = 10;
const FREE_LIMIT = 7;

export default function ClassicScreen() {
  const router = useRouter();
  const { freePlay, recordPlay } = useAppStore();

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
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const nextRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const question = questions[questionIndex];
  const isAnswered = selectedAnswer !== null;

  function clearTimers() {
    if (timerRef.current) clearInterval(timerRef.current);
    if (nextRef.current) clearTimeout(nextRef.current);
  }

  function startTimer() {
    clearTimers();
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          onTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  useEffect(() => {
    startTimer();
    return clearTimers;
  }, [questionIndex]);

  function onTimeout() {
    setSelectedAnswer(-1);
    const newStrikes = strikes + 1;
    setStrikes(newStrikes);
    if (newStrikes >= MAX_STRIKES) {
      nextRef.current = setTimeout(() => endGame(score, newStrikes), 800);
    } else {
      afterAnswer(newStrikes, score);
    }
  }

  function handleAnswer(index: number) {
    if (isAnswered) return;
    clearTimers();
    setSelectedAnswer(index);

    const isCorrect = index === question.correct;
    const newScore = isCorrect ? score + 100 : score;
    const newStrikes = isCorrect ? strikes : strikes + 1;

    if (isCorrect) setScore(newScore);
    else setStrikes(newStrikes);

    if (newStrikes >= MAX_STRIKES) {
      nextRef.current = setTimeout(() => endGame(newScore, newStrikes), 800);
    } else {
      afterAnswer(newStrikes, newScore);
    }
  }

  function afterAnswer(currentStrikes: number, currentScore: number) {
    nextRef.current = setTimeout(() => advance(currentStrikes, currentScore), 500);
  }

  function advance(currentStrikes: number, currentScore: number) {
    setSelectedAnswer(null);
    setTimeLeft(QUESTION_TIME);
    if (questionIndex + 1 >= questions.length) {
      endGame(currentScore, currentStrikes);
    } else {
      setQuestionIndex(i => i + 1);
    }
  }

  function endGame(finalScore: number, finalStrikes: number) {
    clearTimers();
    // Classic mode retired — no high score update. Route unreachable in production.
    router.replace(`/end?score=${finalScore}&mode=arcade&strikes=${finalStrikes}`);
  }

  function getButtonStyle(index: number) {
    if (!isAnswered) return styles.answerButton;
    if (index === question.correct) return [styles.answerButton, styles.correct];
    if (index === selectedAnswer) return [styles.answerButton, styles.wrong];
    return [styles.answerButton, styles.dim];
  }

  const timerColor = timeLeft <= 3 ? '#dc2626' : timeLeft <= 6 ? '#f59e0b' : '#111827';
  const heartsDisplay = '❤️'.repeat(MAX_STRIKES - strikes) + '🖤'.repeat(strikes);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.timer, { color: timerColor }]}>{timeLeft}s</Text>
        <Text style={styles.hearts}>{heartsDisplay}</Text>
        <Text style={styles.score}>{score}</Text>
      </View>

      <Text style={styles.questionNum}>Q {questionIndex + 1}</Text>
      <Text style={styles.question}>{question.question}</Text>

      <View style={styles.answers}>
        {question.options.map((option, i) => (
          <TouchableOpacity
            key={i}
            style={getButtonStyle(i)}
            onPress={() => handleAnswer(i)}
            disabled={isAnswered}
          >
            <Text style={[styles.answerText, (isAnswered && i === question.correct) && styles.answerTextWhite]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24, paddingTop: 60 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  timer: { fontSize: 28, fontWeight: '800' },
  hearts: { fontSize: 20, letterSpacing: 3 },
  score: { fontSize: 22, fontWeight: '700', color: '#111827' },
  questionNum: { fontSize: 13, color: '#9ca3af', fontWeight: '600', marginBottom: 8 },
  question: { fontSize: 26, fontWeight: '600', color: '#111827', marginBottom: 32, lineHeight: 34 },
  answers: { gap: 12 },
  answerButton: { backgroundColor: '#f3f4f6', padding: 18, borderRadius: 12 },
  correct: { backgroundColor: '#16a34a' },
  wrong: { backgroundColor: '#dc2626' },
  dim: { opacity: 0.5 },
  answerText: { fontSize: 18, fontWeight: '500', color: '#111827', textAlign: 'center' },
  answerTextWhite: { color: '#fff' },
});
