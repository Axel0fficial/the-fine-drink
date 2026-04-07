import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import ScreenContainer from "../src/components/ScreenContainer";
import { useGameStore } from "../src/state/gameStore";
import type { Challenge, GamePlayer } from "../src/types/game";

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getEligibleChallengesForPlayer(
  challenges: Challenge[],
  player: GamePlayer | null,
): Challenge[] {
  return challenges.filter((challenge) => {
    if (!challenge.enabled) return false;

    const isDrinkingChallenge = challenge.categories.includes("drinking");

    if (player?.tag === "non_drinker" && isDrinkingChallenge) {
      return false;
    }

    return true;
  });
}

function pickTwoChallengesForPlayer(
  challenges: Challenge[],
  player: GamePlayer | null,
): [Challenge | null, Challenge | null] {
  const eligibleChallenges = getEligibleChallengesForPlayer(challenges, player);

  if (eligibleChallenges.length === 0) return [null, null];
  if (eligibleChallenges.length === 1) return [eligibleChallenges[0], null];

  const shuffled = shuffleArray(eligibleChallenges);
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
  const { selectedPlayers, setSelectedPlayers, challenges, selectedRounds } =
    useGameStore();

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [primaryChallenge, setPrimaryChallenge] = useState<Challenge | null>(
    null,
  );
  const [secondaryChallenge, setSecondaryChallenge] =
    useState<Challenge | null>(null);
  const [selectedChallengeSlot, setSelectedChallengeSlot] = useState<
    "primary" | "secondary"
  >("primary");
  const [statusText, setStatusText] = useState("Start the round.");

  const currentPlayer = selectedPlayers[currentPlayerIndex] ?? null;

  const leader = useMemo(() => {
    if (selectedPlayers.length === 0) return null;
    return [...selectedPlayers].sort((a, b) => b.score - a.score)[0];
  }, [selectedPlayers]);

  const shownChallenge =
    selectedChallengeSlot === "primary" ? primaryChallenge : secondaryChallenge;

  const shownDescription = useMemo(() => {
    if (!shownChallenge) {
      return "No challenge available for this player.";
    }
    return resolveChallengeDescription(shownChallenge);
  }, [shownChallenge]);

  const turnInRound = currentPlayerIndex + 1;

  const generateTurnChallenges = () => {
    const [first, second] = pickTwoChallengesForPlayer(
      challenges,
      currentPlayer,
    );

    setPrimaryChallenge(first);
    setSecondaryChallenge(second);
    setSelectedChallengeSlot("primary");

    if (!first && !second && currentPlayer) {
      setStatusText(
        `${currentPlayer.name} has no eligible challenges with the current rules.`,
      );
    }
  };

  useEffect(() => {
    if (selectedPlayers.length === 0) return;
    generateTurnChallenges();
  }, [selectedPlayers.length, currentPlayerIndex, currentRound]);

  const goToNextPlayer = () => {
    if (selectedPlayers.length === 0) return;

    const isLastPlayerInRound =
      currentPlayerIndex === selectedPlayers.length - 1;
    const isLastRound = currentRound === selectedRounds;

    if (isLastPlayerInRound && isLastRound) {
      router.push("/winner");
      return;
    }

    if (isLastPlayerInRound) {
      setCurrentPlayerIndex(0);
      setCurrentRound((prev) => prev + 1);
    } else {
      setCurrentPlayerIndex((prev) => prev + 1);
    }
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
          <Text style={styles.title}>Round {currentRound}</Text>
          <Text style={styles.turnText}>
            Player {turnInRound} of {selectedPlayers.length}
          </Text>
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
          {shownChallenge ? shownChallenge.title : "No challenge available"}
        </Text>

        <Text style={styles.challengeMeta}>
          {shownChallenge
            ? `${shownChallenge.difficulty.toUpperCase()} • ${shownChallenge.categories.join(", ")}`
            : currentPlayer.tag === "non_drinker"
              ? "This player cannot receive drinking challenges."
              : "No eligible challenge found."}
        </Text>

        <Text style={styles.challengeDescription}>{shownDescription}</Text>
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.statusLabel}>Status</Text>
        <Text style={styles.statusText}>{statusText}</Text>
      </View>

      <View style={styles.bottomRow}>
        <Pressable style={styles.passButton} onPress={handlePass}>
          <Text style={styles.passButtonText}>Pass</Text>
        </Pressable>

        <Pressable
          style={[
            styles.doneButton,
            !shownChallenge && styles.doneButtonDisabled,
          ]}
          onPress={handleDone}
          disabled={!shownChallenge}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
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
  emptyText: {
    marginTop: 12,
    fontSize: 15,
    color: "#b5b5b5",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  finishButton: {
    backgroundColor: "#2b2b2b",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  finishButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
  infoRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  infoCard: {
    flex: 1,
    backgroundColor: "#171717",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 14,
    padding: 14,
  },
  infoLabel: {
    color: "#9ca3af",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  infoValue: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },
  scoreCard: {
    backgroundColor: "#1d1d1d",
    borderWidth: 1,
    borderColor: "#313131",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  scoreLabel: {
    color: "#9ca3af",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  scoreValue: {
    color: "#8b5cf6",
    fontSize: 32,
    fontWeight: "900",
  },
  challengeSwitchRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  challengeToggle: {
    flex: 1,
    backgroundColor: "#222222",
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
    opacity: 0.45,
  },
  challengeToggleText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
  },
  challengeCard: {
    flex: 1,
    backgroundColor: "#171717",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
  },
  challengeTitle: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 8,
  },
  challengeMeta: {
    color: "#8b8b8b",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  challengeDescription: {
    color: "#f3f3f3",
    fontSize: 18,
    lineHeight: 28,
  },
  statusCard: {
    backgroundColor: "#171717",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  statusLabel: {
    color: "#9ca3af",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  statusText: {
    color: "#ffffff",
    fontSize: 14,
    lineHeight: 20,
  },
  bottomRow: {
    flexDirection: "row",
    gap: 12,
  },
  passButton: {
    flex: 1,
    backgroundColor: "#2b2b2b",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  passButtonText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 15,
  },
  doneButton: {
    flex: 1,
    backgroundColor: "#8b5cf6",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  doneButtonDisabled: {
    backgroundColor: "#3b3159",
    opacity: 0.5,
  },
  doneButtonText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 15,
  },
  backButton: {
    marginTop: 18,
    backgroundColor: "#2b2b2b",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 15,
  },
});