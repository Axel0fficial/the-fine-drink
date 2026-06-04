import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import {
  applyChallengePreferences,
  loadChallengePreferences,
  saveChallengePreferences,
} from "@/utils/challengeStorage";

import { StyleSheet, View } from "react-native";

import ChallengeRenderer from "@/components/game/ChallengeRenderer";
import DrinkyLayer from "@/components/game/DrinkyLayer";
import GameActions from "@/components/game/GameActions";
import GameHeader from "@/components/game/GameHeader";
import StatusBar from "@/components/game/StatusBar";
import { getAvailableChallengesForPlayer } from "@/utils/challengeFilters";
import { pickWeightedChallenge } from "@/utils/challengePicker";
import { resolveChallenge } from "@/utils/challengeResolver";

import { sharedStyles } from "@/style/theme";
import { Challenge, Player, PlayerStatus } from "@/types/game";

const sampleChallenges: Challenge[] = [
  {
    id: "1",
    type: "simple",
    title: "Truth Time",
    description: "Tell an embarrassing story or take 3 sips.",
    difficulty: "easy",
    tags: ["drinking"],
    baseChance: 1,
    minChance: 0.2,
    maxChance: 2,
    isFavorite: false,
    likes: 0,
    dislikes: 0,
  },
  {
    id: "2",
    type: "simple",
    title: "Dare",
    description: "Let the group choose a dare for you.",
    difficulty: "normal",
    tags: ["drinking"],
    baseChance: 1,
    minChance: 0.2,
    maxChance: 2,
    isFavorite: false,
    likes: 0,
    dislikes: 0,
  },
  {
    id: "3",
    type: "simple",
    title: "Brutal Choice",
    description: "Take 5 sips or reveal your last search history.",
    difficulty: "hard",
    tags: ["drinking"],
    baseChance: 1,
    minChance: 0.2,
    maxChance: 2,
    isFavorite: false,
    likes: 0,
    dislikes: 0,
  },
  {
    id: "4",
    type: "status",
    title: "Double Trouble",
    description: "For 2 rounds, your punishments are doubled.",
    difficulty: "hard",
    tags: ["drinking"],
    baseChance: 1,
    minChance: 0.2,
    maxChance: 2,
    isFavorite: false,
    likes: 0,
    dislikes: 0,
    statusEffect: {
      id: "double-trouble",
      name: "Double Trouble",
      description: "Your punishments are doubled.",
      remainingRounds: 2,
    },
  },
  {
    id: "5",
    type: "status",
    title: "Silent Curse",
    description: "You cannot talk for 3 rounds. If you do, drink.",
    difficulty: "normal",
    tags: ["drinking"],
    baseChance: 1,
    minChance: 0.2,
    maxChance: 2,
    isFavorite: false,
    likes: 0,
    dislikes: 0,
    statusEffect: {
      id: "silent-curse",
      name: "Silent Curse",
      description: "You cannot talk. If you talk, drink.",
      remainingRounds: 3,
    },
  },
  {
    id: "6",
    type: "status",
    title: "Forever Suspicious",
    description:
      "For the rest of the session, everyone may question your choices.",
    difficulty: "brutal",
    tags: ["drinking"],
    baseChance: 1,
    minChance: 0.2,
    maxChance: 2,
    isFavorite: false,
    likes: 0,
    dislikes: 0,
    statusEffect: {
      id: "forever-suspicious",
      name: "Forever Suspicious",
      description:
        "Everyone may question your choices for the rest of the session.",
      remainingRounds: 99,
    },
  },
  {
    id: "7",
    type: "simple",
    title: "Exercise Tax",
    description: "Do {x} {y} or drink {z} sips.",
    difficulty: "easy",
    tags: ["drinking"],
    baseChance: 1,
    minChance: 0.2,
    maxChance: 2,
    isFavorite: false,
    likes: 0,
    dislikes: 0,
    variables: [
      {
        type: "number",
        key: "x",
        min: 5,
        max: 15,
      },
      {
        type: "pool",
        key: "y",
        pools: ["exercises"],
      },
      {
        type: "number",
        key: "z",
        min: 1,
        max: 3,
      },
    ],
  },
  {
    id: "8",
    type: "simple",
    title: "FMK",
    description: "Fuck, Marry, Kill: {x}, {y}, {z}.",
    difficulty: "normal",
    tags: ["drinking"],
    baseChance: 1,
    minChance: 0.2,
    maxChance: 2,
    isFavorite: false,
    likes: 0,
    dislikes: 0,
    variables: [
      {
        type: "poolGroup",
        keys: ["x", "y", "z"],
        allowedPools: ["attractivePeople", "villains", "lovablePeople"],
        allowRepeats: false,
      },
    ],
  },
  {
    id: "9",
    type: "minigame",
    title: "The Fine Drink",
    description: "A mysterious offer appears.",
    difficulty: "brutal",
    tags: ["drinking"],
    baseChance: 1,
    minChance: 0.2,
    maxChance: 2,
    isFavorite: false,
    likes: 0,
    dislikes: 0,
    minigameType: "fineDrink",
    fineDrinkData: {
      offerNature: "random",
    },
  },
  {
    id: "10",
    type: "simple",
    title: "Human Tower",
    description:
      "{team} must make a human pyramid or everyone in that team drinks 2 sips.",
    difficulty: "normal",
    tags: ["teams", "drinking"],
    baseChance: 1,
    minChance: 0.2,
    maxChance: 2,
    isFavorite: false,
    likes: 0,
    dislikes: 0,
    variables: [
      {
        type: "team",
        key: "team",
      },
    ],
  },
  {
    id: "11",
    type: "simple",
    title: "Team Pose",
    description: "{team} must recreate a movie poster.",
    difficulty: "easy",
    tags: ["teams", "nonDrinkerSafe"],
    baseChance: 1,
    minChance: 0.2,
    maxChance: 2,
    isFavorite: false,
    likes: 0,
    dislikes: 0,
    variables: [
      {
        type: "team",
        key: "team",
      },
    ],
  },
];

export default function GameScreen() {
  const params = useLocalSearchParams();

  const initialPlayers: Player[] = JSON.parse(
    (params.players as string) || "[]",
  ).map((player: Player) => ({
    ...player,
    statuses: player.statuses ?? [],
  }));

  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [turn, setTurn] = useState<number>(0);
  const [challenge, setChallenge] = useState<Challenge>(
    resolveChallenge(sampleChallenges[0], initialPlayers),
  );
  const [challenges, setChallenges] = useState<Challenge[]>(sampleChallenges);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [feedbackUsed, setFeedbackUsed] = useState(false);
  const teamsEnabled = JSON.parse((params.teamsEnabled as string) || "false");

  const currentPlayer = players[turn % players.length];

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
        ? resolveChallenge(updater(currentChallenge))
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

  function goToNextChallenge() {
    if (!currentPlayer) return;

    const availableChallenges = getAvailableChallengesForPlayer(
      challenges,
      currentPlayer,
      { teamsEnabled },
    );

    const pickedChallenge = pickWeightedChallenge(availableChallenges);

    if (!pickedChallenge) {
      setChallenge(
        resolveChallenge(
          {
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
          },
          players,
        ),
      );

      return;
    }

    setChallenge(resolveChallenge(pickedChallenge, players));
    setFeedbackUsed(false);
    setTurn((currentTurn) => currentTurn + 1);
  }

  function nextTurn() {
    if (challenge.type === "status") {
      applyStatusToCurrentPlayer();
    }

    goToNextChallenge();
  }
  useEffect(() => {
    async function loadSavedData() {
      const savedPreferences = await loadChallengePreferences();

      const updatedChallenges = applyChallengePreferences(
        sampleChallenges,
        savedPreferences,
      );

      setChallenges(updatedChallenges);
      setChallenge(resolveChallenge(updatedChallenges[0]));
      setPreferencesLoaded(true);
    }

    loadSavedData();
  }, []);

  useEffect(() => {
    if (!preferencesLoaded) return;

    saveChallengePreferences(challenges);
  }, [challenges, preferencesLoaded]);

  if (challenge.type === "minigame") {
    return (
      <ChallengeRenderer
        challenge={challenge}
        onFinishMinigame={goToNextChallenge}
        onApplyStatuses={applyStatusesToCurrentPlayer}
      />
    );
  }

  return (
    <View style={[sharedStyles.screen, styles.container]}>
      <GameHeader turn={turn} currentPlayer={currentPlayer} />

      <StatusBar statuses={currentPlayer?.statuses ?? []} />

      <ChallengeRenderer
        challenge={challenge}
        onToggleFavorite={handleToggleFavorite}
      />

      <GameActions
        onSkip={nextTurn}
        onDone={nextTurn}
        onLike={handleLike}
        onDislike={handleDislike}
        feedbackUsed={feedbackUsed}
      />

      <DrinkyLayer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 70,
  },
});
