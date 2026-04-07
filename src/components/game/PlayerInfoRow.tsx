import React from "react";
import { Text, View } from "react-native";
import { gameSharedStyles as styles } from "../style/gameSharedStyles";

type Props = {
  currentPlayerName: string;
  leaderText: string;
  currentScore: number;
};

export default function PlayerInfoRow({
  currentPlayerName,
  leaderText,
  currentScore,
}: Props) {
  return (
    <>
      <View style={styles.infoRow}>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Current Player</Text>
          <Text style={styles.infoValue}>{currentPlayerName}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Leader / King</Text>
          <Text style={styles.infoValue}>{leaderText}</Text>
        </View>
      </View>

      <View style={styles.scoreCard}>
        <Text style={styles.scoreLabel}>Score</Text>
        <Text style={styles.scoreValue}>{currentScore}</Text>
      </View>
    </>
  );
}