import { colors, radius, sharedStyles, spacing } from "@/style/theme";
import { TimedButtonData, TimedButtonPrompt } from "@/types/game";
import { useLanguageStore } from "@/utils/languageStore";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type TimedButtonMinigameProps = {
  data: TimedButtonData;
  playerName: string;
  onFinish: () => void;
};

function randomFromArray<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export default function TimedButtonMinigame({
  data,
  playerName,
  onFinish,
}: TimedButtonMinigameProps) {
  const { language } = useLanguageStore();

  const prompt = useMemo<TimedButtonPrompt>(() => {
    return randomFromArray(data.prompts);
  }, []);

  const [timeLeft, setTimeLeft] = useState(prompt.seconds);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [failed, setFailed] = useState(false);

  const promptText = prompt.text[language];

  useEffect(() => {
    if (!started || completed || failed) return;

    if (timeLeft <= 0) {
      setFailed(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((current) => Number((current - 0.01).toFixed(2)));
    }, 10);

    return () => clearTimeout(timer);
  }, [started, completed, failed, timeLeft]);

  useEffect(() => {
    if (!completed) return;

    const timer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => clearTimeout(timer);
  }, [completed]);

  function handleMainButton() {
    if (!started) {
      setStarted(true);
      return;
    }

    if (failed || completed) return;

    setCompleted(true);
  }

  const buttonState = completed
    ? styles.completedButton
    : failed
      ? styles.failedButton
      : started
        ? styles.activeButton
        : styles.readyButton;

  const buttonText = completed
    ? "Completed!"
    : failed
      ? "Failed"
      : started
        ? "DONE"
        : "START";

  return (
    <View style={styles.container}>
      <Text style={styles.player}>{playerName}</Text>

      <View style={styles.promptBox}>
        <Text style={styles.prompt}>{promptText}</Text>
      </View>

      <Text
        style={[
          styles.timer,
          timeLeft <= 3 && !completed && styles.urgentTimer,
          failed && styles.failedTimer,
          completed && styles.completedTimer,
        ]}
      >
        {timeLeft.toFixed(2)}
      </Text>

      <Pressable
        style={[styles.mainButton, buttonState]}
        onPress={handleMainButton}
        disabled={failed || completed}
      >
        <Text style={styles.mainButtonText}>{buttonText}</Text>
      </Pressable>

      {failed && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Time's up!</Text>
          <Text style={styles.resultText}>You failed the timer challenge.</Text>

          <Pressable style={styles.continueButton} onPress={onFinish}>
            <Text style={sharedStyles.buttonText}>Continue</Text>
          </Pressable>
        </View>
      )}

      {completed && <Text style={styles.autoContinueText}>Moving on...</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B10",
    padding: spacing.xl,
    paddingTop: 70,
    justifyContent: "space-between",
  },
  player: {
    color: colors.mutedText,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  promptBox: {
    backgroundColor: colors.surface,
    borderColor: "#7B3FE4",
    borderWidth: 2,
    borderRadius: radius.xl,
    padding: spacing.xl,
  },
  prompt: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 38,
  },
  timer: {
    color: "#7B3FE4",
    fontSize: 96,
    fontWeight: "bold",
    textAlign: "center",
    fontVariant: ["tabular-nums"],
  },
  failedTimer: {
    color: "#ff0000",
  },
  completedTimer: {
    color: "#3498DB",
  },
  urgentTimer: {
    color: "#ff0000",
  },
  mainButton: {
    height: 120,
    borderRadius: radius.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  readyButton: {
    backgroundColor: "#ff3b3b",
  },
  activeButton: {
    backgroundColor: "#2ECC71",
  },
  completedButton: {
    backgroundColor: "#3498DB",
  },
  failedButton: {
    backgroundColor: "#0B0B10",
  },
  mainButtonText: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "bold",
  },
  resultBox: {
    backgroundColor: colors.surface,
    borderColor: "#7B3FE4",
    borderWidth: 1,
    borderRadius: radius.xl,
    padding: spacing.lg,
  },
  resultTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  resultText: {
    color: colors.mutedText,
    textAlign: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  continueButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: "center",
  },
  autoContinueText: {
    color: colors.mutedText,
    textAlign: "center",
    fontWeight: "bold",
  },
});
