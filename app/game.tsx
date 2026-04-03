import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import ScreenContainer from "../src/components/ScreenContainer";
import { useGameStore } from "../src/state/gameStore";
import type { Challenge } from "../src/types/game";

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickTwoChallenges(
  challenges: Challenge[],
): [Challenge | null, Challenge | null] {
  const enabledChallenges = challenges.filter((challenge) => challenge.enabled);

  if (enabledChallenges.length === 0) return [null, null];
  if (enabledChallenges.length === 1) return [enabledChallenges[0], null];

  const shuffled = shuffleArray(enabledChallenges);
  return [shuffled[0], shuffled[1]];
}

function resolveChallengeDescription(challenge: Challenge): string {
  if (!challenge.logicType || challenge.logicType === "none") {
    return challenge.description;
  }

  if (challenge.logicType === "range" && challenge.logicConfig) {
    const variable = challenge.logicConfig.variable ?? "x";
    const min = challenge.logicConfig.min ?? 1;
    const max = challenge.logicConfig.max ?? min;
    const rolledValue = Math.floor(Math.random() * (max - min + 1)) + min;

    return challenge.description.replace(`{${variable}}`, String(rolledValue));
  }

  if (challenge.logicType === "timer" && challenge.logicConfig?.seconds) {
    return challenge.description.replace(
      "{seconds}",
      String(challenge.logicConfig.seconds),
    );
  }

  if (
    challenge.logicType === "status_effect" &&
    challenge.logicConfig?.rounds
  ) {
    return challenge.description.replace(
      "{rounds}",
      String(challenge.logicConfig.rounds),
    );
  }

  return challenge.description;
}

export default function GameScreen() {
  const { selectedPlayers, setSelectedPlayers, challenges } = useGameStore();

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [primaryChallenge, setPrimaryChallenge] = useState<Challenge | null>(
    null,
  );
  const [secondaryChallenge, setSecondaryChallenge] =
    useState<Challenge | null>(null);
  const [selectedChallengeSlot, setSelectedChallengeSlot] = useState<
    "primary" | "secondary"
  >("primary");
  const [statusText, setStatusText] = useState("Start the round.");
  const [turnCounter, setTurnCounter] = useState(1);

  const currentPlayer = selectedPlayers[currentPlayerIndex] ?? null;

  const leader = useMemo(() => {
    if (selectedPlayers.length === 0) return null;
    return [...selectedPlayers].sort((a, b) => b.score - a.score)[0];
  }, [selectedPlayers]);

  const shownChallenge =
    selectedChallengeSlot === "primary" ? primaryChallenge : secondaryChallenge;

  const shownDescription = useMemo(() => {
    if (!shownChallenge) return "No challenge available.";
    return resolveChallengeDescription(shownChallenge);
  }, [shownChallenge]);

  const generateTurnChallenges = () => {
    const [first, second] = pickTwoChallenges(challenges);
    setPrimaryChallenge(first);
    setSecondaryChallenge(second);
    setSelectedChallengeSlot("primary");
  };

  useEffect(() => {
    if (selectedPlayers.length === 0) return;
    generateTurnChallenges();
  }, [selectedPlayers.length]);

  const goToNextPlayer = () => {
    if (selectedPlayers.length === 0) return;

    const nextIndex = (currentPlayerIndex + 1) % selectedPlayers.length;
    setCurrentPlayerIndex(nextIndex);
    setTurnCounter((prev) => prev + 1);
    generateTurnChallenges();
  };

  const handleDone = () => {
    if (!currentPlayer || !shownChallenge) {
      Alert.alert(
        "Missing challenge",
        "No challenge is available for this turn.",
      );
      return;
    }

    const updatedPlayers = selectedPlayers.map((player) =>
      player.id === currentPlayer.id
        ? { ...player, score: player.score + shownChallenge.points }
        : player,
    );

    setSelectedPlayers(updatedPlayers);

    setStatusText(
      `${currentPlayer.name} completed "${shownChallenge.title}" and earned ${shownChallenge.points} point${
        shownChallenge.points === 1 ? "" : "s"
      }.`,
    );

    goToNextPlayer();
  };

  const handlePass = () => {
    if (!currentPlayer) return;

    setStatusText(`${currentPlayer.name} passed this turn.`);
    goToNextPlayer();
  };

  const handleFinishGame = () => {
    router.push("/winner");
  };

  if (!currentPlayer) {
    return (
      <ScreenContainer>
        <Text style={styles.title}>Game</Text>
        <Text style={styles.emptyText}>No players selected.</Text>

        <Pressable
          style={styles.backButton}
          onPress={() => router.push("/players")}
        >
          <Text style={styles.backButtonText}>Back to Players</Text>
        </Pressable>
      </ScreenContainer>
    );
  }

  const canToggle = !!secondaryChallenge;

  return (
    <ScreenContainer>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.title}>Game</Text>
          <Text style={styles.turnText}>Turn {turnCounter}</Text>
        </View>

        <Pressable style={styles.finishButton} onPress={handleFinishGame}>
          <Text style={styles.finishButtonText}>Finish</Text>
        </Pressable>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Current Player</Text>
          <Text style={styles.infoValue}>{currentPlayer.name}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Leader / King</Text>
          <Text style={styles.infoValue}>
            {leader ? `${leader.name} (${leader.score})` : "None"}
          </Text>
        </View>
      </View>

      <View style={styles.scoreCard}>
        <Text style={styles.scoreLabel}>Score</Text>
        <Text style={styles.scoreValue}>{currentPlayer.score}</Text>
      </View>

      <View style={styles.challengeSwitchRow}>
        <Pressable
          style={[
            styles.challengeToggle,
            selectedChallengeSlot === "primary" && styles.challengeToggleActive,
          ]}
          onPress={() => setSelectedChallengeSlot("primary")}
        >
          <Text style={styles.challengeToggleText}>Challenge A</Text>
        </Pressable>

        <Pressable
          style={[
            styles.challengeToggle,
            selectedChallengeSlot === "secondary" &&
              styles.challengeToggleActive,
            !canToggle && styles.challengeToggleDisabled,
          ]}
          onPress={() => {
            if (canToggle) setSelectedChallengeSlot("secondary");
          }}
        >
          <Text style={styles.challengeToggleText}>Challenge B</Text>
        </Pressable>
      </View>

      <View style={styles.challengeCard}>
        <Text style={styles.challengeTitle}>
          {shownChallenge?.title ?? "No challenge"}
        </Text>
        <Text style={styles.challengeDescription}>{shownDescription}</Text>
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.statusLabel}>Status</Text>
        <Text style={styles.statusText}>{statusText}</Text>
      </View>

      <View style={styles.actionsRow}>
        <Pressable style={styles.passButton} onPress={handlePass}>
          <Text style={styles.passButtonText}>Pass</Text>
        </Pressable>

        <Pressable style={styles.doneButton} onPress={handleDone}>
          <Text style={styles.doneButtonText}>Done</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111111",
    paddingHorizontal: 18,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
    gap: 12,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#ffffff",
  },
  turnText: {
    marginTop: 4,
    fontSize: 14,
    color: "#b5b5b5",
  },
  finishButton: {
    backgroundColor: "#1f1f1f",
    borderWidth: 1,
    borderColor: "#333333",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  finishButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  infoRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },
  infoCard: {
    flex: 1,
    backgroundColor: "#1b1b1b",
    borderWidth: 1,
    borderColor: "#2f2f2f",
    borderRadius: 16,
    padding: 14,
  },
  infoLabel: {
    color: "#aaaaaa",
    fontSize: 12,
    marginBottom: 6,
  },
  infoValue: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "800",
  },
  scoreCard: {
    backgroundColor: "#2b2144",
    borderWidth: 1,
    borderColor: "#8b5cf6",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  scoreLabel: {
    color: "#d8cfff",
    fontSize: 13,
    marginBottom: 4,
  },
  scoreValue: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "900",
  },
  challengeSwitchRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  challengeToggle: {
    flex: 1,
    backgroundColor: "#1d1d1d",
    borderWidth: 1,
    borderColor: "#313131",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  challengeToggleActive: {
    backgroundColor: "#2b2144",
    borderColor: "#8b5cf6",
  },
  challengeToggleDisabled: {
    opacity: 0.4,
  },
  challengeToggleText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  challengeCard: {
    flex: 1,
    backgroundColor: "#171717",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 18,
    padding: 18,
    justifyContent: "center",
    marginBottom: 14,
  },
  challengeTitle: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 12,
    textAlign: "center",
  },
  challengeDescription: {
    color: "#d0d0d0",
    fontSize: 18,
    lineHeight: 28,
    textAlign: "center",
  },
  statusCard: {
    backgroundColor: "#1b1b1b",
    borderWidth: 1,
    borderColor: "#2f2f2f",
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  statusLabel: {
    color: "#aaaaaa",
    fontSize: 12,
    marginBottom: 6,
  },
  statusText: {
    color: "#ffffff",
    fontSize: 14,
    lineHeight: 20,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  passButton: {
    flex: 1,
    backgroundColor: "#2b2b2b",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  passButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },
  doneButton: {
    flex: 1,
    backgroundColor: "#8b5cf6",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  doneButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },
  emptyText: {
    color: "#ffffff",
    fontSize: 18,
    marginTop: 20,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "#8b5cf6",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  backButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },
});
