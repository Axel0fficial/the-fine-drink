import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors, radius, sharedStyles, spacing } from "@/style/theme";
import RunnerSvg from "./RunnerSvg";

type HorseRaceMinigameProps = {
  onFinish: () => void;
};

const runnerPalette = {
  Purple: {
    shirt: "#c300d1",
    pants: "#44006b",
    hair: "#ff66fe",
  },
  Yellow: {
    shirt: "#F1C40F",
    pants: "#ff9700",
    hair: "#d5ff6e",
  },
  Red: {
    shirt: "#ff0020",
    pants: "#910012",
    hair: "#ff5268",
  },
  Blue: {
    shirt: "#1800ff",
    pants: "#0f009a",
    hair: "#8d81ff",
  },
} as const;

const racers = [
  {
    id: "purple",
    name: "Purple Drinky",
    palette: runnerPalette.Purple,
  },
  {
    id: "yellow",
    name: "Yellow Drinky",
    palette: runnerPalette.Yellow,
  },
  {
    id: "red",
    name: "Red Drinky",
    palette: runnerPalette.Red,
  },
  {
    id: "blue",
    name: "Blue Drinky",
    palette: runnerPalette.Blue,
  },
];

function randomRaceDuration() {
  return 5200 + Math.floor(Math.random() * 1800);
}

function DrinkyRunner({
  shirt,
  pants,
  hair,
}: {
  shirt: string;
  pants: string;
  hair: string;
}) {
  return (
    <RunnerSvg width={54} height={54} shirt={shirt} pants={pants} hair={hair} />
  );
}
export default function HorseRaceMinigame({
  onFinish,
}: HorseRaceMinigameProps) {
  const screenWidth = Dimensions.get("window").width;
  const raceDistance = Math.max(screenWidth - 140, 220);

  const positions = useRef(racers.map(() => new Animated.Value(0))).current;

  const [started, setStarted] = useState(false);
  const [winnerId, setWinnerId] = useState<string | null>(null);

  const winnerIndex = useMemo(() => {
    return Math.floor(Math.random() * racers.length);
  }, []);

  useEffect(() => {
    async function lockLandscape() {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE,
      );
    }

    lockLandscape();

    return () => {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP,
      );
    };
  }, []);

  function startRace() {
    if (started) return;

    setStarted(true);
    setWinnerId(null);

    positions.forEach((position) => position.setValue(0));

    const animations = positions.map((position, index) => {
      const isWinner = index === winnerIndex;

      return Animated.timing(position, {
        toValue: isWinner
          ? raceDistance
          : raceDistance * (0.72 + Math.random() * 0.2),
        duration: isWinner ? 5200 : randomRaceDuration(),
        useNativeDriver: true,
      });
    });

    Animated.parallel(animations).start(() => {
      setWinnerId(racers[winnerIndex].id);
    });
  }

  const winner = racers.find((racer) => racer.id === winnerId);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Drinky Race</Text>
        <Text style={styles.subtitle}>
          Place your bets before pressing Start.
        </Text>
      </View>

      <View style={styles.trackBox}>
        {racers.map((racer, index) => (
          <View key={racer.id} style={styles.trackRow}>
            <Text style={styles.laneLabel}>{index + 1}</Text>

            <View style={styles.track}>
              <Animated.View
                style={[
                  styles.racer,
                  {
                    transform: [{ translateX: positions[index] }],
                  },
                ]}
              >
                <DrinkyRunner
                  shirt={racer.palette.shirt}
                  pants={racer.palette.pants}
                  hair={racer.palette.hair}
                />
              </Animated.View>

              <View style={styles.finishLine} />
            </View>
          </View>
        ))}
      </View>

      {winner ? (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>{winner.name} wins!</Text>
          <Text style={styles.resultText}>
            Winning bets gift their drinks. Losing bets drink theirs.
          </Text>

          <Pressable style={styles.continueButton} onPress={onFinish}>
            <Text style={sharedStyles.buttonText}>Continue</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable
          style={[styles.startButton, started && styles.disabledButton]}
          disabled={started}
          onPress={startRace}
        >
          <Text style={sharedStyles.buttonText}>
            {started ? "Racing..." : "Start Race"}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#151019",
    padding: spacing.lg,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "bold",
  },
  subtitle: {
    color: colors.mutedText,
    marginTop: 4,
    fontWeight: "bold",
  },
  trackBox: {
    gap: spacing.sm,
  },
  trackRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  laneLabel: {
    width: 28,
    color: colors.text,
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  track: {
    flex: 1,
    height: 54,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: radius.lg,
    justifyContent: "center",
    overflow: "hidden",
    borderColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
  },
  racer: {
    width: 58,
    height: 54,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
  },
  finishLine: {
    position: "absolute",
    right: 18,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: "#fff",
  },
  startButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: "center",
  },
  continueButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: "center",
    marginTop: spacing.md,
  },
  resultBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderColor: colors.primary,
    borderWidth: 1,
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
  },
  disabledButton: {
    opacity: 0.5,
  },
});
