import React from "react";
import { Text, View } from "react-native";
import { gameSharedStyles as styles } from "../style/gameSharedStyles";

type Props = {
  currentPlayerName: string;
  currentScore: number;
};

export default function PlayerInfoRow({
  currentPlayerName,
  currentScore,
}: Props) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Current Player</Text>
        <Text style={styles.infoValue}>{currentPlayerName}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Score</Text>
        <Text style={styles.scoreValueSmall}>{currentScore}</Text>
      </View>
    </View>
  );
}
