import { quickChoiceQuestions } from "@/data/quickChoiceData";
import { text } from "@/locales/text";
import { colors, radius, spacing } from "@/style/theme";
import { QuickChoiceData, QuickChoiceQuestion } from "@/types/game";
import { useLanguageStore } from "@/utils/languageStore";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type QuickChoiceMinigameProps = {
  data: QuickChoiceData;
  playerName: string;
  onFinish: () => void;
};

function randomFromArray<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function QuickChoiceMinigame({
  data,
  playerName,
  onFinish,
}: QuickChoiceMinigameProps) {
  const questions = useMemo(() => shuffle(quickChoiceQuestions), []);
  const [correctIsTop, setCorrectIsTop] = useState(() => Math.random() < 0.5);
  const { language, toggleLanguage } = useLanguageStore();
  const t = text[language];
  const [timeLeft, setTimeLeft] = useState(data.durationSeconds);
  const [index, setIndex] = useState(0);
  const [right, setRight] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [answers, setAnswers] = useState<
    {
      question: QuickChoiceQuestion;
      selected: string;
      wasCorrect: boolean;
    }[]
  >([]);
  const [finished, setFinished] = useState(false);

  const currentQuestion = questions[index];

  const resultText =
    right > wrong
      ? randomFromArray(data.rewards)
      : randomFromArray(data.punishments);

  useEffect(() => {
    if (finished) return;

    if (timeLeft <= 0) {
      setFinished(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((current) => current - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, finished]);
  function getWrongOption(question: QuickChoiceQuestion) {
    const normalizedCorrectOptions = question.correctOptions.map((option) =>
      option.toLowerCase(),
    );

    const availableWrongOptions = data.wrongOptionPool.filter(
      (option) => !normalizedCorrectOptions.includes(option.toLowerCase()),
    );

    return randomFromArray(availableWrongOptions);
  }

  function choose(option: string) {
    if (!currentQuestion || finished) return;

    const wasCorrect = currentQuestion.correctOptions
      .map((correctOption) => correctOption.toLowerCase())
      .includes(option.toLowerCase());

    setAnswers((current) => [
      ...current,
      {
        question: currentQuestion,
        selected: option,
        wasCorrect,
      },
    ]);

    if (wasCorrect) {
      setRight((current) => current + 1);
    } else {
      setWrong((current) => current + 1);
    }

    if (index + 1 >= questions.length) {
      setFinished(true);
      return;
    }

    setCorrectIsTop(Math.random() < 0.5);
    setIndex((current) => current + 1);
  }

  if (finished) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{t.timeexclLbl}</Text>

        <Text style={styles.score}>
          {right} {t.rightlbl} · {wrong} {t.wronglbl}
        </Text>

        <View style={styles.resultBox}>
          <Text style={styles.resultText}>{resultText}</Text>
        </View>

        <View style={styles.answersBox}>
          <Text style={styles.answersTitle}>{t.correctansLbl} </Text>

          {answers.map((answer, answerIndex) => (
            <Text
              key={`${answer.question.word}-${answerIndex}`}
              style={styles.answerText}
            >
              {answer.question.word}:{" "}
              {answer.question.correctOptions.join(" / ")}
            </Text>
          ))}
        </View>

        <Pressable style={styles.continueButton} onPress={onFinish}>
          <Text style={styles.continueText}>{t.continueLabel}</Text>
        </Pressable>
      </View>
    );
  }

  const correctOption = currentQuestion
    ? randomFromArray(currentQuestion.correctOptions)
    : "";

  const wrongOption = currentQuestion ? getWrongOption(currentQuestion) : "";
  const topOption = correctIsTop ? correctOption : wrongOption;
  const bottomOption = correctIsTop ? wrongOption : correctOption;

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{timeLeft}</Text>

      <Text style={styles.player}>{playerName}</Text>

      <Text style={styles.title}>{t.whatislbl}</Text>

      <View style={styles.wordBox}>
        <Text style={styles.word}>{currentQuestion?.word}</Text>
      </View>

      <View style={styles.optionBox}>
        <Pressable
          style={styles.optionButton}
          onPress={() => choose(topOption)}
        >
          <Text style={styles.optionText}>{topOption}</Text>
        </Pressable>

        <Pressable
          style={styles.optionButton}
          onPress={() => choose(bottomOption)}
        >
          <Text style={styles.optionText}>{bottomOption}</Text>
        </Pressable>
      </View>

      <Text style={styles.score}>
        {right} {t.rightlbl} · {wrong} {t.wronglbl}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#151515",
    padding: spacing.xl,
    paddingTop: 70,
    justifyContent: "space-between",
  },
  timer: {
    color: "#fff",
    fontSize: 54,
    fontWeight: "bold",
    textAlign: "center",
  },
  player: {
    color: colors.mutedText,
    textAlign: "center",
    fontSize: 18,
  },
  title: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
  },
  wordBox: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    padding: spacing.xl,
  },
  word: {
    color: "#fff",
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
  },
  optionBox: {
    gap: spacing.md,
  },
  optionButton: {
    backgroundColor: "#fff",
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: "center",
  },
  optionText: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: "bold",
  },
  score: {
    color: colors.mutedText,
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
  resultBox: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    padding: spacing.xl,
  },
  resultText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  answersBox: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  answersTitle: {
    color: "#fff",
    fontWeight: "bold",
    marginBottom: spacing.md,
    fontSize: 18,
  },
  answerText: {
    color: colors.mutedText,
    marginBottom: 6,
  },
  continueButton: {
    backgroundColor: "#fff",
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: "center",
  },
  continueText: {
    color: colors.primary,
    fontWeight: "bold",
    fontSize: 18,
  },
});
