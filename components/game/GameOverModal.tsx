import { router } from "expo-router";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, sharedStyles, spacing } from "@/style/theme";
import { Player } from "@/types/game";

type GameOverModalProps = {
  visible: boolean;
  players: Player[];
};

export default function GameOverModal({
  visible,
  players,
}: GameOverModalProps) {
  const leaderboard = [...players].sort((a, b) => b.score - a.score);
  const winner = leaderboard[0];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>Game Over</Text>

          {winner && (
            <Text style={styles.winner}>
              Winner: {winner.name} with {winner.score} points
            </Text>
          )}

          <View style={styles.list}>
            {leaderboard.map((player, index) => (
              <View key={player.id} style={styles.row}>
                <Text style={styles.position}>#{index + 1}</Text>
                <Text style={styles.name}>{player.name}</Text>
                <Text style={styles.score}>{player.score}</Text>
              </View>
            ))}
          </View>

          <Pressable
            style={sharedStyles.primaryButton}
            onPress={() => router.replace("/players")}
          >
            <Text style={sharedStyles.buttonText}>Back to Players</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    padding: spacing.xl,
  },
  modalBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderColor: colors.primary,
    borderWidth: 1,
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  winner: {
    color: colors.primaryLight,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  list: {
    marginBottom: spacing.xl,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  position: {
    color: colors.primaryLight,
    width: 42,
    fontWeight: "bold",
  },
  name: {
    color: colors.text,
    flex: 1,
    fontWeight: "bold",
  },
  score: {
    color: colors.text,
    fontWeight: "bold",
  },
});
