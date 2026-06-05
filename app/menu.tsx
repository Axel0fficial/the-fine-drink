import { router, useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, sharedStyles, spacing } from "../style/theme";

type Player = {
  id: string;
  name: string;
  score: number;
};

export default function MenuScreen() {
  const params = useLocalSearchParams();

  const players: Player[] = JSON.parse((params.players as string) || "[]");
  const teamsEnabled = JSON.parse((params.teamsEnabled as string) || "false");
  const roundLimit = Number(params.roundLimit || 10);

  function startGame() {
    router.push({
      pathname: "/game",
      params: {
        players: JSON.stringify(players),
        teamsEnabled: JSON.stringify(teamsEnabled),
        roundLimit: String(roundLimit),
      },
    });
  }

  return (
    <View style={sharedStyles.centeredScreen}>
      <Text style={sharedStyles.title}>Game Menu</Text>

      <Text style={styles.subtitle}>
        {players.length} players ready · {roundLimit} rounds · Teams{" "}
        {teamsEnabled ? "On" : "Off"}
      </Text>

      <Pressable style={sharedStyles.primaryButton} onPress={startGame}>
        <Text style={sharedStyles.buttonText}>Play</Text>
      </Pressable>

      <Pressable style={styles.editButton} onPress={() => router.back()}>
        <Text style={styles.editText}>Edit Players</Text>
      </Pressable>
      <Pressable
        style={styles.secondaryButton}
        onPress={() => router.push("/settings")}
      >
        <Text style={styles.secondaryText}>Settings</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  subtitle: {
    color: colors.mutedText,
    fontSize: 18,
    textAlign: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.xxl,
  },
  editButton: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    alignItems: "center",
  },
  editText: {
    color: colors.mutedText,
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },

  secondaryText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "bold",
  },
});
