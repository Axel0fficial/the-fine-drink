import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text } from "react-native";

import ScreenContainer from "../src/components/ScreenContainer";
import ChallengeView from "../src/components/game/ChallengeView";
import GameActions from "../src/components/game/GameActions";
import GameHeader from "../src/components/game/GameHeader";
import PlayerInfoRow from "../src/components/game/PlayerInfoRow";
import StatusView from "../src/components/game/StatusView";
import {
  pickTwoChallengesForPlayer,
  resolveChallengeDescription,
} from "../src/game/gameLogic";
import { useGameStore } from "../src/state/gameStore";
import type { Challenge } from "../src/types/game";

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
  const leaderText = leader ? `${leader.name} (${leader.score})` : "None";

  return (
    <ScreenContainer>
      <GameHeader
        currentRound={currentRound}
        turnInRound={turnInRound}
        totalPlayers={selectedPlayers.length}
        onFinish={handleFinishGame}
      />

      <PlayerInfoRow
        currentPlayerName={currentPlayer.name}
        leaderText={leaderText}
        currentScore={currentPlayer.score}
      />

      <ChallengeView
        selectedChallengeSlot={selectedChallengeSlot}
        onSelectPrimary={() => setSelectedChallengeSlot("primary")}
        onSelectSecondary={() => setSelectedChallengeSlot("secondary")}
        canToggle={canToggle}
        shownChallenge={shownChallenge}
        shownDescription={shownDescription}
        currentPlayerTag={currentPlayer.tag}
      />

      <StatusView statusText={statusText} />

      <GameActions
        onPass={handlePass}
        onDone={handleDone}
        doneDisabled={!shownChallenge}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#ffffff",
  },
  emptyText: {
    marginTop: 12,
    fontSize: 15,
    color: "#b5b5b5",
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