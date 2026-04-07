import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  currentRound: number;
  turnInRound: number;
  totalPlayers: number;
  onFinish: () => void;
};

export default function GameHeader({
  currentRound,
  turnInRound,
  totalPlayers,
  onFinish,
}: Props) {
  return (
    <View style={styles.topBar}>
      <View>
        <Text style={styles.title}>Round {currentRound}</Text>
        <Text style={styles.turnText}>
          Player {turnInRound} of {totalPlayers}
        </Text>
      </View>

      <Pressable style={styles.finishButton} onPress={onFinish}>
        <Text style={styles.finishButtonText}>Finish</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#ffffff",
  },
  turnText: {
    marginTop: 4,
    fontSize: 14,
    color: "#b5b5b5",
  },
  finishButton: {
    backgroundColor: "#2b2b2b",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  finishButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
});