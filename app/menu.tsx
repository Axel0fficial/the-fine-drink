import { router, useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, sharedStyles, spacing } from "../style/theme";

type Player = {
  id: string;
  name: string;
  score: number;
};

export default function MenuScreen() {
  const params = useLocalSearchParams();

  const players: Player[] = JSON.parse((params.players as string) || "[]");
  const teamsEnabled = JSON.parse((params.teamsEnabled as string) || "false");

  function startGame() {
    router.push({
      pathname: "/game",
      params: {
        players: JSON.stringify(players),
        teamsEnabled: JSON.stringify(teamsEnabled),
      },
    });
  }

  return (
    <View style={sharedStyles.centeredScreen}>
      <Text style={sharedStyles.title}>Game Menu</Text>

      <Text style={styles.subtitle}>{players.length} players ready</Text>

      <Pressable style={sharedStyles.primaryButton} onPress={startGame}>
        <Text style={sharedStyles.buttonText}>Play</Text>
      </Pressable>

      <Pressable style={styles.editButton} onPress={() => router.back()}>
        <Text style={styles.editText}>Edit Players</Text>
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
});
