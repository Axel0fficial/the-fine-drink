import ChallengeRenderer from "@/components/game/ChallengeRenderer";
import DrinkyLayer from "@/components/game/DrinkyLayer";
import GameActions from "@/components/game/GameActions";
import GameHeader from "@/components/game/GameHeader";
import GameOverModal from "@/components/game/GameOverModal";
import GameSettingsModal from "@/components/game/GameSettingsModal";
import StatusBar from "@/components/game/StatusBar";

import { challenges as defaultChallenges } from "@/data/challenges";
import { colors, difficultyPalettes, sharedStyles } from "@/style/theme";
import {
  Challenge,
  DrinkyEvent,
  GameMode,
  GameModifierId,
  GameModifierSettings,
  Player,
  PlayerStatus,
  SessionDifficulty,
} from "@/types/game";
import {
  applyChallengeEnabledSettings,
  loadChallengeEnabledSettings,
} from "@/utils/challengeEnabledStorage";
import { getAvailableChallengesForPlayer } from "@/utils/challengeFilters";
import { pickWeightedChallenge } from "@/utils/challengePicker";
import { resolveChallenge } from "@/utils/challengeResolver";
import {
  applyChallengePreferences,
  loadChallengePreferences,
  saveChallengePreferences,
} from "@/utils/challengeStorage";
import { loadCustomChallenges } from "@/utils/customChallengeStorage";
import { pickDrinkyEvent } from "@/utils/drinkyPicker";
import { loadDrinkyEnabled } from "@/utils/drinkyStorage";
import { getChallengeScore, getScoreWithModifiers } from "@/utils/scoreUtils";
import { tickPlayerStatuses } from "@/utils/statusUtils";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function GameScreen() {
  const params = useLocalSearchParams();

  const initialPlayers: Player[] = JSON.parse(
    (params.players as string) || "[]",
  ).map((player: Player) => ({
    ...player,
    score: player.score ?? 0,
    statuses: player.statuses ?? [],
    preferences: {
      nonDrinker: player.preferences?.nonDrinker ?? false,
    },
    team: player.team ?? "none",
  }));

  const teamsEnabled = JSON.parse((params.teamsEnabled as string) || "false");
  const roundLimit = Number(params.roundLimit || 10);
  const sessionDifficulty = ((params.sessionDifficulty as string) ||
    "normal") as SessionDifficulty;

  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [challenges, setChallenges] = useState<Challenge[]>(defaultChallenges);

  const [turn, setTurn] = useState(0);
  const [challenge, setChallenge] = useState<Challenge>(
    resolveChallenge(getFallbackChallenge(), initialPlayers),
  );
  const gameMode = ((params.gameMode as string) || "standard") as GameMode;
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
  const activePalette = difficultyPalettes[challenge.difficulty];
  const enabledGameModifiers: GameModifierId[] = JSON.parse(
    (params.gameModifiers as string) || "[]",
  );
  const gameModifierSettings: GameModifierSettings = JSON.parse(
    (params.gameModifierSettings as string) || "{}",
  );

  useEffect(() => {
    async function loadSavedData() {
      const savedPreferences = await loadChallengePreferences();
      const sessionDifficulty = ((params.sessionDifficulty as string) ||
        "normal") as SessionDifficulty;

      let playableChallenges = defaultChallenges;

      if (gameMode === "custom") {
        const customChallenges = await loadCustomChallenges();
        const enabledSettings = await loadChallengeEnabledSettings();

        const defaultWithSettings = applyChallengeEnabledSettings(
          defaultChallenges,
          enabledSettings,
        );

        playableChallenges = [
          ...defaultWithSettings,
          ...customChallenges,
        ].filter((challenge) => challenge.enabled);
      }

      const updatedChallenges = applyChallengePreferences(
        playableChallenges,
        savedPreferences,
      );

      setChallenges(updatedChallenges);

      const initialChallenge =
        updatedChallenges.length > 0
          ? resolveChallenge(
              updatedChallenges[0],
              initialPlayers,
              initialPlayers[0],
            )
          : resolveChallenge(getFallbackChallenge(), initialPlayers);

      setChallenge(initialChallenge);

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

  function tickStatusesForCurrentPlayer() {
    if (!currentPlayer) return;

    setPlayers((currentPlayers) =>
      currentPlayers.map((player) =>
        player.id === currentPlayer.id ? tickPlayerStatuses(player) : player,
      ),
    );
  }

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

    const points = getScoreWithModifiers(
      challenge,
      currentPlayer,
      players,
      enabledGameModifiers,
    );

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

  function handleFineDrinkAccept(statuses: PlayerStatus[]) {
    if (!currentPlayer) return;

    const points = getScoreWithModifiers(
      challenge,
      currentPlayer,
      players,
      enabledGameModifiers,
    );

    setPlayers((currentPlayers) =>
      currentPlayers.map((player) => {
        if (player.id !== currentPlayer.id) return player;

        return {
          ...player,
          score: player.score + points,
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

    finishTurn(false);
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

      title: {
        en: "Configuration Error",
        es: "Error de configuración",
      },

      description: {
        en: "No enabled challenge matched the current game settings.",
        es: "Ningún desafío habilitado coincide con la configuración actual del juego.",
      },

      difficulty: "easy",
      tags: ["nonDrinkerSafe"],
      enabled: true,
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
      const fallback = resolveChallenge(
        getFallbackChallenge(),
        players,
        nextPlayer,
      );
      setChallenge(fallback);
      return;
    }

    const availableChallenges = getAvailableChallengesForPlayer(
      challenges,
      nextPlayer,
      { teamsEnabled },
    );

    console.log("Next player:", nextPlayer.name);
    console.log("Non drinker:", nextPlayer.preferences?.nonDrinker);
    console.log("Teams enabled:", teamsEnabled);
    console.log("Available challenges:", availableChallenges.length);

    const pickedChallenge = pickWeightedChallenge(
      availableChallenges,
      nextPlayer,
      players,
      sessionDifficulty,
      enabledGameModifiers,
      gameModifierSettings,
    );

    if (!pickedChallenge) {
      const fallback = resolveChallenge(getFallbackChallenge(), players);
      setChallenge(fallback);
      maybeShowDrinky(nextPlayer, fallback);
      return;
    }
    const resolvedChallenge = resolveChallenge(
      pickedChallenge,
      players,
      nextPlayer,
    );

    setChallenge(resolvedChallenge);
    maybeShowDrinky(nextPlayer, resolvedChallenge);
  }
  function finishTurn(shouldScore: boolean) {
    if (shouldScore) {
      addScoreToCurrentPlayer();

      if (challenge.type === "status") {
        applyStatusToCurrentPlayer();
      }
    }

    tickStatusesForCurrentPlayer();

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
          currentPlayerName={currentPlayer?.name}
          onFinishMinigame={() => finishTurn(false)}
          onApplyStatuses={handleFineDrinkAccept}
        />

        <GameOverModal
          visible={gameOverVisible}
          players={players}
          palette={activePalette}
        />
      </>
    );
  }

  return (
    <View
      style={[
        sharedStyles.screen,
        styles.container,
        { backgroundColor: activePalette.background },
      ]}
    >
      <GameHeader
        round={currentRound}
        currentPlayer={currentPlayer}
        palette={activePalette}
        rightAction={
          <Pressable
            style={[
              styles.settingsButton,
              { backgroundColor: activePalette.primary },
            ]}
            onPress={() => setSettingsVisible(true)}
          >
            <Text style={[styles.settingsText, { color: activePalette.text }]}>
              ⚙
            </Text>
          </Pressable>
        }
        statusAction={
          <StatusBar
            statuses={currentPlayer?.statuses ?? []}
            currentPlayer={currentPlayer}
            players={players}
            enabledGameModifiers={enabledGameModifiers}
            palette={activePalette}
            gameModifierSettings={gameModifierSettings}
          />
        }
      />

      <ChallengeRenderer
        challenge={challenge}
        currentPlayerName={currentPlayer?.name}
        onToggleFavorite={handleToggleFavorite}
        palette={activePalette}
      />

      <GameActions
        onSkip={handleSkip}
        onDone={handleDone}
        onLike={handleLike}
        onDislike={handleDislike}
        feedbackUsed={feedbackUsed}
        palette={activePalette}
      />

      <GameSettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        roundLimit={roundLimit}
        currentRound={Math.min(currentRound, roundLimit)}
        palette={activePalette}
      />

      <DrinkyLayer
        event={drinkyEvent}
        hidden={drinkyHidden}
        onHide={() => setDrinkyHidden(true)}
        onShow={() => setDrinkyHidden(false)}
        onAcceptStatus={handleAcceptDrinkyStatus}
      />

      <GameOverModal
        visible={gameOverVisible}
        players={players}
        palette={activePalette}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
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
