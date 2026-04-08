import React from "react";
import { StyleSheet, Text, View } from "react-native";

import DiceDuelMiniGame from "../../minigames/diceDuel/DiceDuelMiniGame";
import FineDrinkMiniGame from "../../minigames/fineDrink/fineDrinkMiniGame";
import type { MiniGameResult } from "../../minigames/types";
import type { Challenge, GamePlayer } from "../../types/game";

type Props = {
  challenge: Challenge;
  currentPlayer: GamePlayer;
  allPlayers: GamePlayer[];
  onComplete: (result: MiniGameResult) => void;
};

export default function MiniGameHost({
  challenge,
  currentPlayer,
  allPlayers,
  onComplete,
}: Props) {
  switch (challenge.minigameType) {
    case "dice_duel":
      return (
        <DiceDuelMiniGame
          challenge={challenge}
          currentPlayer={currentPlayer}
          allPlayers={allPlayers}
          onComplete={onComplete}
        />
      );

    case "fine_drink":
      return (
        <FineDrinkMiniGame
          challenge={challenge}
          currentPlayer={currentPlayer}
          onComplete={onComplete}
        />
      );

    default:
      return (
        <View style={styles.card}>
          <Text style={styles.title}>Unsupported minigame</Text>
          <Text style={styles.text}>
            This challenge references a minigame that has not been implemented
            yet.
          </Text>
        </View>
      );
  }
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
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 8,
  },
  text: {
    color: "#ffffff",
    fontSize: 14,
    lineHeight: 20,
  },
});
