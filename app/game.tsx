import { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { QUESTIONS, shuffleQuestions } from './questions';
import { useAppStore } from './store';

const TOTAL_TIME = 60;
const FREE_LIMIT = 7;

export default function GameScreen() {
  const router = useRouter();
  const { updateHighScore, freePlay, recordPlay } = useAppStore();
  const [questions] = useState(() => shuffleQuestions(QUESTIONS));

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
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const answerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const question = questions[questionIndex];
  const isAnswered = selectedAnswer !== null;

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, []);

  useEffect(() => {
    if (timeLeft === 0 && !isAnswered) {
      updateHighScore('arcade', score);
      router.replace(`/end?score=${score}&mode=arcade`);
    }
  }, [timeLeft, isAnswered, score]);

  function handleAnswer(index: number) {
    if (isAnswered) return;
    setSelectedAnswer(index);

    const isCorrect = index === question.correct;
    const newScore = isCorrect ? score + 100 : score;
    if (isCorrect) setScore(newScore);

    const delay = isCorrect ? 500 : 1500;

    answerTimerRef.current = setTimeout(() => {
      const nextIndex = questionIndex + 1;
      if (nextIndex >= questions.length || timeLeft === 0) {
        updateHighScore('arcade', newScore);
        router.replace(`/end?score=${newScore}&mode=arcade`);
      } else {
        setQuestionIndex(nextIndex);
        setSelectedAnswer(null);
      }
    }, delay);
  }

  useEffect(() => {
    return () => {
      if (answerTimerRef.current) clearTimeout(answerTimerRef.current);
    };
  }, []);

  function getButtonStyle(index: number) {
    if (!isAnswered) return styles.answerButton;
    if (index === question.correct) return [styles.answerButton, styles.correct];
    if (index === selectedAnswer) return [styles.answerButton, styles.wrong];
    return styles.answerButton;
  }

  const flashColor =
    isAnswered
      ? selectedAnswer === question.correct
        ? '#bbf7d0'
        : '#fecaca'
      : '#fff';

  return (
    <View style={[styles.container, { backgroundColor: flashColor }]}>
      <View style={styles.header}>
        <Text style={styles.timer}>⏱ {timeLeft}s</Text>
        <Text style={styles.score}>Score: {score}</Text>
      </View>

      <Text style={styles.questionNumber}>
        Question {questionIndex + 1} / {questions.length}
      </Text>

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
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  timer: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  score: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  questionNumber: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  question: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 40,
    lineHeight: 36,
  },
  answers: {
    gap: 16,
  },
  answerButton: {
    backgroundColor: '#e5e7eb',
    padding: 18,
    borderRadius: 10,
  },
  correct: {
    backgroundColor: '#16a34a',
  },
  wrong: {
    backgroundColor: '#dc2626',
  },
  answerText: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
});
