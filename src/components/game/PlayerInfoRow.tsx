import React from "react";
import { StyleSheet, Text, View } from "react-native";

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

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  infoCard: {
    flex: 1,
    backgroundColor: "#171717",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 14,
    padding: 14,
  },
  infoLabel: {
    color: "#9ca3af",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  infoValue: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },
  scoreCard: {
    backgroundColor: "#1d1d1d",
    borderWidth: 1,
    borderColor: "#313131",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  scoreLabel: {
    color: "#9ca3af",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  scoreValue: {
    color: "#8b5cf6",
    fontSize: 32,
    fontWeight: "900",
  },
});