import ChallengeRenderer from "@/components/game/ChallengeRenderer";
import DrinkyLayer from "@/components/game/DrinkyLayer";
import GameActions from "@/components/game/GameActions";
import GameHeader from "@/components/game/GameHeader";
import GameOverModal from "@/components/game/GameOverModal";
import GameSettingsModal from "@/components/game/GameSettingsModal";
import StatusBar from "@/components/game/StatusBar";
import { DrinkyEvent } from "@/types/game";
import { pickDrinkyEvent } from "@/utils/drinkyPicker";
import { loadDrinkyEnabled } from "@/utils/drinkyStorage";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { challenges as defaultChallenges } from "@/data/challenges";
import { colors, sharedStyles, spacing } from "@/style/theme";
import { Challenge, Player, PlayerStatus } from "@/types/game";

import { getAvailableChallengesForPlayer } from "@/utils/challengeFilters";
import { pickWeightedChallenge } from "@/utils/challengePicker";
import { resolveChallenge } from "@/utils/challengeResolver";
import {
  applyChallengePreferences,
  loadChallengePreferences,
  saveChallengePreferences,
} from "@/utils/challengeStorage";
import { getChallengeScore } from "@/utils/scoreUtils";

export default function GameScreen() {
  const params = useLocalSearchParams();

  const initialPlayers: Player[] = JSON.parse(
    (params.players as string) || "[]",
  ).map((player: Player) => ({
    ...player,
    statuses: player.statuses ?? [],
  }));

  const teamsEnabled = JSON.parse((params.teamsEnabled as string) || "false");
  const roundLimit = Number(params.roundLimit || 10);

  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [challenges, setChallenges] = useState<Challenge[]>(defaultChallenges);

  const [turn, setTurn] = useState(0);
  const [challenge, setChallenge] = useState<Challenge>(
    resolveChallenge(defaultChallenges[0], initialPlayers),
  );

  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [feedbackUsed, setFeedbackUsed] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [gameOverVisible, setGameOverVisible] = useState(false);

  const totalTurns = players.length * roundLimit;
  const currentRound = Math.floor(turn / players.length) + 1;
  const currentPlayer = players[turn % players.length];

  const [drinkyEnabled, setDrinkyEnabled] = useState(true);
  const [drinkyEvent, setDrinkyEvent] = useState<DrinkyEvent | null>(null);
  const [drinkyHidden, setDrinkyHidden] = useState(false);
  const [drinkyAppearances, setDrinkyAppearances] = useState(0);

  useEffect(() => {
    async function loadSavedData() {
      const savedPreferences = await loadChallengePreferences();

      const updatedChallenges = applyChallengePreferences(
        defaultChallenges,
        savedPreferences,
      );

      setChallenges(updatedChallenges);
      setChallenge(resolveChallenge(updatedChallenges[0], initialPlayers));
      setPreferencesLoaded(true);
    }

    loadSavedData();
  }, []);

  useEffect(() => {
    if (!preferencesLoaded) return;

    saveChallengePreferences(challenges);
  }, [challenges, preferencesLoaded]);

  useEffect(() => {
    async function loadDrinkySetting() {
      const enabled = await loadDrinkyEnabled();
      setDrinkyEnabled(enabled);
    }

    loadDrinkySetting();
  }, []);

  function maybeShowDrinky(nextPlayer: Player, nextChallenge: Challenge) {
    if (!drinkyEnabled) return;
    if (nextChallenge.type === "minigame") return;

    const turnsLeft = totalTurns - turn;
    const needsMoreAppearances = drinkyAppearances < 2;
    const forceChance = needsMoreAppearances && turnsLeft <= 4;
    const randomChance = Math.random() < 0.25;

    if (!forceChance && !randomChance) {
      setDrinkyEvent(null);
      return;
    }

    const event = pickDrinkyEvent(
      nextPlayer,
      nextChallenge,
      challenges,
      players,
      teamsEnabled,
    );

    if (!event) {
      setDrinkyEvent(null);
      return;
    }

    setDrinkyEvent(event);
    setDrinkyHidden(false);
    setDrinkyAppearances((current) => current + 1);
  }
  function handleAcceptDrinkyStatus() {
    if (!drinkyEvent?.statusEffect || !currentPlayer) return;

    setPlayers((currentPlayers) =>
      currentPlayers.map((player) => {
        if (player.id !== currentPlayer.id) return player;

        return {
          ...player,
          statuses: [
            ...player.statuses,
            {
              ...drinkyEvent.statusEffect!,
              id: `${drinkyEvent.statusEffect!.id}-${Date.now()}-${Math.random()}`,
              sourceChallengeId: drinkyEvent.id,
            },
          ],
        };
      }),
    );

    setDrinkyEvent(null);
  }

  function updateChallengeById(
    challengeId: string,
    updater: (challenge: Challenge) => Challenge,
  ) {
    setChallenges((currentChallenges) =>
      currentChallenges.map((item) =>
        item.id === challengeId ? updater(item) : item,
      ),
    );

    setChallenge((currentChallenge) =>
      currentChallenge.id === challengeId
        ? resolveChallenge(updater(currentChallenge), players)
        : currentChallenge,
    );
  }

  function handleToggleFavorite() {
    updateChallengeById(challenge.id, (item) => ({
      ...item,
      isFavorite: !item.isFavorite,
    }));
  }

  function handleLike() {
    if (feedbackUsed) return;

    updateChallengeById(challenge.id, (item) => ({
      ...item,
      likes: item.likes + 1,
    }));

    setFeedbackUsed(true);
  }

  function handleDislike() {
    if (feedbackUsed) return;

    updateChallengeById(challenge.id, (item) => ({
      ...item,
      dislikes: item.dislikes + 1,
    }));

    setFeedbackUsed(true);
  }

  function addScoreToCurrentPlayer() {
    if (!currentPlayer) return;

    const points = getChallengeScore(challenge);

    setPlayers((currentPlayers) =>
      currentPlayers.map((player) =>
        player.id === currentPlayer.id
          ? {
              ...player,
              score: player.score + points,
            }
          : player,
      ),
    );
  }

  function applyStatusToCurrentPlayer() {
    if (!challenge.statusEffect || !currentPlayer) return;

    setPlayers((currentPlayers) =>
      currentPlayers.map((player) => {
        if (player.id !== currentPlayer.id) return player;

        return {
          ...player,
          statuses: [
            ...player.statuses,
            {
              ...challenge.statusEffect!,
              id: `${challenge.statusEffect!.id}-${Date.now()}`,
              sourceChallengeId: challenge.id,
            },
          ],
        };
      }),
    );
  }

  function applyStatusesToCurrentPlayer(statuses: PlayerStatus[]) {
    if (!currentPlayer) return;

    setPlayers((currentPlayers) =>
      currentPlayers.map((player) => {
        if (player.id !== currentPlayer.id) return player;

        return {
          ...player,
          score: player.score + getChallengeScore(challenge),
          statuses: [
            ...player.statuses,
            ...statuses.map((status) => ({
              ...status,
              id: `${status.id}-${Date.now()}-${Math.random()}`,
              sourceChallengeId: challenge.id,
            })),
          ],
        };
      }),
    );
  }

  function getFallbackChallenge(): Challenge {
    return {
      id: "fallback",
      type: "simple",
      title: "No Challenge Available",
      description: "No valid challenge was found for this player.",
      difficulty: "easy",
      tags: ["nonDrinkerSafe"],
      baseChance: 1,
      minChance: 1,
      maxChance: 1,
      isFavorite: false,
      likes: 0,
      dislikes: 0,
    };
  }

  function pickNextChallenge(nextTurnValue: number) {
    const nextPlayer = players[nextTurnValue % players.length];

    if (!nextPlayer) {
      setChallenge(resolveChallenge(getFallbackChallenge(), players));
      return;
    }

    const availableChallenges = getAvailableChallengesForPlayer(
      challenges,
      nextPlayer,
      { teamsEnabled },
    );

    const pickedChallenge = pickWeightedChallenge(availableChallenges);

    if (!pickedChallenge) {
      setChallenge(resolveChallenge(getFallbackChallenge(), players));
      return;
    }
    const resolvedChallenge = resolveChallenge(pickedChallenge, players);

    setChallenge(resolvedChallenge);
    maybeShowDrinky(nextPlayer, resolvedChallenge);
    setChallenge(resolveChallenge(pickedChallenge, players));
    const fallback = resolveChallenge(getFallbackChallenge(), players);
    setChallenge(fallback);
    maybeShowDrinky(nextPlayer, fallback);
  }

  function finishTurn(shouldScore: boolean) {
    if (shouldScore) {
      addScoreToCurrentPlayer();

      if (challenge.type === "status") {
        applyStatusToCurrentPlayer();
      }
    }

    const nextTurnValue = turn + 1;

    if (nextTurnValue >= totalTurns) {
      setGameOverVisible(true);
      return;
    }

    pickNextChallenge(nextTurnValue);
    setFeedbackUsed(false);
    setTurn(nextTurnValue);
  }

  function handleDone() {
    finishTurn(true);
  }

  function handleSkip() {
    finishTurn(false);
  }

  if (challenge.type === "minigame") {
    return (
      <>
        <ChallengeRenderer
          challenge={challenge}
          onFinishMinigame={() => finishTurn(false)}
          onApplyStatuses={applyStatusesToCurrentPlayer}
        />

        <GameOverModal visible={gameOverVisible} players={players} />
      </>
    );
  }

  return (
    <View style={[sharedStyles.screen, styles.container]}>
      <View style={styles.topRow}>
        <Pressable
          style={styles.settingsButton}
          onPress={() => setSettingsVisible(true)}
        >
          <Text style={styles.settingsText}>⚙</Text>
        </Pressable>
      </View>

      <GameHeader
        turn={turn}
        round={currentRound}
        currentPlayer={currentPlayer}
      />

      <StatusBar statuses={currentPlayer?.statuses ?? []} />

      <ChallengeRenderer
        challenge={challenge}
        onToggleFavorite={handleToggleFavorite}
      />

      <GameActions
        onSkip={handleSkip}
        onDone={handleDone}
        onLike={handleLike}
        onDislike={handleDislike}
        feedbackUsed={feedbackUsed}
      />

      <DrinkyLayer
        event={drinkyEvent}
        hidden={drinkyHidden}
        onHide={() => setDrinkyHidden(true)}
        onShow={() => setDrinkyHidden(false)}
        onAcceptStatus={handleAcceptDrinkyStatus}
      />

      <GameSettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        roundLimit={roundLimit}
        currentRound={Math.min(currentRound, roundLimit)}
      />

      <GameOverModal visible={gameOverVisible} players={players} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
  },
  topRow: {
    alignItems: "flex-end",
    marginBottom: spacing.md,
  },
  settingsButton: {
    backgroundColor: colors.surfaceLight,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  settingsText: {
    color: colors.text,
    fontSize: 22,
  },
});
