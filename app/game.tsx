import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";

import ScreenContainer from "../src/components/ScreenContainer";
import ActiveStatusesPanel from "../src/components/game/ActiveStatusesPanel";
import ChallengeView from "../src/components/game/ChallengeView";
import GameActions from "../src/components/game/GameActions";
import GameHeader from "../src/components/game/GameHeader";
import MiniGameHost from "../src/components/game/MiniGameHost";
import PlayerInfoRow from "../src/components/game/PlayerInfoRow";
import { gameSharedStyles } from "../src/components/style/gameSharedStyles";
import {
  pickTwoChallengesForPlayer,
  resolveChallenge,
  type ResolvedChallenge,
} from "../src/game/gameLogic";
import type { MatchStatus, MiniGameResult } from "../src/minigames/types";
import { useGameStore } from "../src/state/gameStore";

export default function GameScreen() {
  const { selectedPlayers, setSelectedPlayers, challenges, selectedRounds } =
    useGameStore();

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [primaryChallenge, setPrimaryChallenge] =
    useState<ResolvedChallenge | null>(null);
  const [secondaryChallenge, setSecondaryChallenge] =
    useState<ResolvedChallenge | null>(null);
  const [selectedChallengeSlot, setSelectedChallengeSlot] = useState<
    "primary" | "secondary"
  >("primary");
  const [statusText, setStatusText] = useState("Start the round.");

  const currentPlayer = selectedPlayers[currentPlayerIndex] ?? null;

  const shownResolvedChallenge =
    selectedChallengeSlot === "primary" ? primaryChallenge : secondaryChallenge;

  const shownChallenge = shownResolvedChallenge?.challenge ?? null;
  const shownDescription =
    shownResolvedChallenge?.description ??
    "No challenge available for this player.";

  const isMiniGameChallenge =
    shownChallenge?.presentationType === "minigame" &&
    !!shownChallenge.minigameType;

  const turnInRound = currentPlayerIndex + 1;

  const generateTurnChallenges = () => {
    const [first, second] = pickTwoChallengesForPlayer(
      challenges,
      currentPlayer,
    );

    const resolvedFirst = resolveChallenge(first);
    const resolvedSecond = resolveChallenge(second);

    setPrimaryChallenge(resolvedFirst);
    setSecondaryChallenge(resolvedSecond);
    setSelectedChallengeSlot("primary");

    if (!resolvedFirst && !resolvedSecond && currentPlayer) {
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

  const awardPointsToCurrentPlayer = (points: number) => {
    if (!currentPlayer || points <= 0) return;

    const updatedPlayers = selectedPlayers.map((player) =>
      player.id === currentPlayer.id
        ? { ...player, score: player.score + points }
        : player,
    );

    setSelectedPlayers(updatedPlayers);
  };

  const handleDone = () => {
    if (!currentPlayer || !shownChallenge) {
      Alert.alert(
        "Missing challenge",
        "No challenge is available for this turn.",
      );
      return;
    }

    awardPointsToCurrentPlayer(shownChallenge.points);

    setStatusText(
      `${currentPlayer.name} completed "${shownChallenge.title}" and earned ${shownChallenge.points} point${
        shownChallenge.points === 1 ? "" : "s"
      }.`,
    );

    goToNextPlayer();
  };

  const [activeStatuses, setActiveStatuses] = useState<MatchStatus[]>([]);
  const visibleStatuses = activeStatuses.filter((status) => {
    if (status.scope === "global") return true;
    return status.playerId === currentPlayer?.id;
  });
  const handleMiniGameComplete = (result: MiniGameResult) => {
    if (!currentPlayer || !shownChallenge) return;

    if (result.pointsAwarded && result.pointsAwarded > 0) {
      awardPointsToCurrentPlayer(result.pointsAwarded);
    }

    const appliedStatus = result.appliedStatus;
    if (appliedStatus) {
      setActiveStatuses((prev) => [...prev, appliedStatus]);
    }

    setStatusText(
      result.statusText ??
        `${currentPlayer.name} finished the minigame "${shownChallenge.title}".`,
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
        <Text style={gameSharedStyles.title}>Game</Text>
        <Text style={gameSharedStyles.emptyText}>No players selected.</Text>

        <Pressable
          style={gameSharedStyles.backButton}
          onPress={() => router.push("/players")}
        >
          <Text style={gameSharedStyles.backButtonText}>Back to Players</Text>
        </Pressable>
      </ScreenContainer>
    );
  }

  const canToggle = !!secondaryChallenge;

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
        currentScore={currentPlayer.score}
      />

      {isMiniGameChallenge && shownChallenge ? (
        <MiniGameHost
          key={`${currentRound}-${currentPlayer.id}-${shownChallenge.id}-${selectedChallengeSlot}`}
          challenge={shownChallenge}
          currentPlayer={currentPlayer}
          allPlayers={selectedPlayers}
          onComplete={handleMiniGameComplete}
        />
      ) : (
        <ChallengeView
          selectedChallengeSlot={selectedChallengeSlot}
          onSelectPrimary={() => setSelectedChallengeSlot("primary")}
          onSelectSecondary={() => setSelectedChallengeSlot("secondary")}
          canToggle={canToggle}
          shownChallenge={shownChallenge}
          shownDescription={shownDescription}
          currentPlayerTag={currentPlayer.tag}
        />
      )}

      {activeStatuses.length > 0 && (
        <View
          style={{
            backgroundColor: "#171717",
            borderWidth: 1,
            borderColor: "#2a2a2a",
            borderRadius: 14,
            padding: 14,
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              color: "#9ca3af",
              fontSize: 12,
              fontWeight: "700",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Active Match Statuses
          </Text>

          <ActiveStatusesPanel statuses={visibleStatuses} />
        </View>
      )}

      {!isMiniGameChallenge && (
        <GameActions
          onPass={handlePass}
          onDone={handleDone}
          doneDisabled={!shownChallenge}
        />
      )}
    </ScreenContainer>
  );
}
