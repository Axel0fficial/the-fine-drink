import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Challenge, GamePlayer } from "../../types/game";
import type { MiniGameResult } from "../types";

type Props = {
  challenge: Challenge;
  currentPlayer: GamePlayer;
  allPlayers: GamePlayer[];
  onComplete: (result: MiniGameResult) => void;
};

function getRandomDieValue(sides: number) {
  return Math.floor(Math.random() * sides) + 1;
}

export default function DiceDuelMiniGame({
  challenge,
  currentPlayer,
  allPlayers,
  onComplete,
}: Props) {
  const sides = challenge.minigameConfig?.sides ?? 6;

  const opponent = useMemo(() => {
    const otherPlayers = allPlayers.filter((player) => player.id !== currentPlayer.id);
    return otherPlayers[0] ?? null;
  }, [allPlayers, currentPlayer.id]);

  const [playerRoll, setPlayerRoll] = useState<number | null>(null);
  const [opponentRoll, setOpponentRoll] = useState<number | null>(null);
  const [phase, setPhase] = useState<"idle" | "player_rolled" | "finished">("idle");

  const handlePlayerRoll = () => {
    const roll = getRandomDieValue(sides);
    setPlayerRoll(roll);
    setPhase("player_rolled");
  };

  const handleOpponentRoll = () => {
    if (!opponent) return;

    const rollA = playerRoll ?? getRandomDieValue(sides);
    const rollB = getRandomDieValue(sides);

    setPlayerRoll(rollA);
    setOpponentRoll(rollB);
    setPhase("finished");

    const playerName = currentPlayer.name;
    const opponentName = opponent.name;

    if (rollA > rollB) {
      onComplete({
        outcome: "win",
        pointsAwarded: challenge.points,
        statusText: `${playerName} won the dice duel against ${opponentName} (${rollA} vs ${rollB}).`,
        payload: {
          playerRoll: rollA,
          opponentRoll: rollB,
          opponentId: opponent.id,
        },
      });
      return;
    }

    if (rollA < rollB) {
      onComplete({
        outcome: "lose",
        pointsAwarded: 0,
        statusText: `${playerName} lost the dice duel against ${opponentName} (${rollA} vs ${rollB}).`,
        payload: {
          playerRoll: rollA,
          opponentRoll: rollB,
          opponentId: opponent.id,
        },
      });
      return;
    }

    onComplete({
      outcome: "tie",
      pointsAwarded: 0,
      statusText: `${playerName} tied the dice duel with ${opponentName} (${rollA} vs ${rollB}).`,
      payload: {
        playerRoll: rollA,
        opponentRoll: rollB,
        opponentId: opponent.id,
      },
    });
  };

  if (!opponent) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Dice Duel</Text>
        <Text style={styles.text}>You need at least 2 players for this minigame.</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{challenge.title}</Text>
      <Text style={styles.subtitle}>{challenge.description}</Text>

      <View style={styles.scoreRow}>
        <View style={styles.rollCard}>
          <Text style={styles.label}>{currentPlayer.name}</Text>
          <Text style={styles.rollValue}>{playerRoll ?? "-"}</Text>
        </View>

        <View style={styles.rollCard}>
          <Text style={styles.label}>{opponent.name}</Text>
          <Text style={styles.rollValue}>{opponentRoll ?? "-"}</Text>
        </View>
      </View>

      {phase === "idle" && (
        <Pressable style={styles.primaryButton} onPress={handlePlayerRoll}>
          <Text style={styles.primaryButtonText}>Roll for {currentPlayer.name}</Text>
        </Pressable>
      )}

      {phase === "player_rolled" && (
        <Pressable style={styles.primaryButton} onPress={handleOpponentRoll}>
          <Text style={styles.primaryButtonText}>Roll for {opponent.name}</Text>
        </Pressable>
      )}

      {phase === "finished" && (
        <Text style={styles.text}>Resolving result...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#171717",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
  },
  title: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 8,
  },
  subtitle: {
    color: "#8b8b8b",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 18,
  },
  scoreRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  rollCard: {
    flex: 1,
    backgroundColor: "#1f1f1f",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
  },
  label: {
    color: "#b5b5b5",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
  },
  rollValue: {
    color: "#ffffff",
    fontSize: 42,
    fontWeight: "900",
  },
  text: {
    color: "#ffffff",
    fontSize: 14,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: "#8b5cf6",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 15,
  },
});