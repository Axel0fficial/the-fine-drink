import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, Text } from "react-native";

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
  const {
  selectedPlayers,
  setSelectedPlayers,
  challenges,
  selectedRounds,
  selectedGameModeId,
  customModeEnabledCategories,
  customModeDisabledChallengeIds,
} = useGameStore();

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
  const [activeStatuses, setActiveStatuses] = useState<MatchStatus[]>([]);

  const currentPlayer = selectedPlayers[currentPlayerIndex] ?? null;

  const activeChallenges = useMemo(() => {
    if (selectedGameModeId === "custom") {
      return challenges.filter((challenge) => {
        const categoryAllowed = challenge.categories.some((category) =>
          customModeEnabledCategories.includes(category),
        );

        const enabledForCustom = !customModeDisabledChallengeIds.includes(
          challenge.id,
        );

        return categoryAllowed && enabledForCustom;
      });
    }

    return challenges;
  }, [
    challenges,
    customModeEnabledCategories,
    customModeDisabledChallengeIds,
    selectedGameModeId,
  ]);

  const shownResolvedChallenge =
    selectedChallengeSlot === "primary" ? primaryChallenge : secondaryChallenge;

  const shownChallenge = shownResolvedChallenge?.challenge ?? null;
  const shownDescription =
    shownResolvedChallenge?.description ??
    "No challenge available for this player.";

  const isMiniGameChallenge =
    shownChallenge?.presentationType === "minigame" &&
    !!shownChallenge.minigameType;

  const isFineDrinkChallenge = shownChallenge?.minigameType === "fine_drink";

  const turnInRound = currentPlayerIndex + 1;

  const visibleStatuses = useMemo(() => {
    return activeStatuses.filter((status) => {
      if (status.scope === "global") return true;
      return status.playerId === currentPlayer?.id;
    });
  }, [activeStatuses, currentPlayer?.id]);

  const generateTurnChallenges = () => {
    const [first, second] = pickTwoChallengesForPlayer(
      activeChallenges,
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

  if (isFineDrinkChallenge && shownChallenge) {
    return (
      <ScreenContainer backgroundColor="#4a0059">
        <MiniGameHost
          key={`${currentRound}-${currentPlayer.id}-${shownChallenge.id}-${selectedChallengeSlot}`}
          challenge={shownChallenge}
          currentPlayer={currentPlayer}
          allPlayers={selectedPlayers}
          onComplete={handleMiniGameComplete}
          fullScreen
        />
      </ScreenContainer>
    );
  }

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

      <ActiveStatusesPanel statuses={visibleStatuses} />


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