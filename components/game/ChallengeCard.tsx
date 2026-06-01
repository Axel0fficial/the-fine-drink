import { colors, radius, spacing } from "@/style/theme";
import { Challenge } from "@/types/game";
import { StyleSheet, Text, View } from "react-native";

type ChallengeCardProps = {
  challenge: Challenge;
};

export default function ChallengeCard({ challenge }: ChallengeCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{challenge.title}</Text>

      <Text style={styles.difficulty}>
        {challenge.difficulty.toUpperCase()}
      </Text>

      <Text style={styles.description}>{challenge.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.primary,
    borderWidth: 2,
    borderRadius: radius.xl,
    padding: spacing.xl,
    minHeight: 260,
    justifyContent: "center",
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  difficulty: {
    color: colors.primaryLight,
    textAlign: "center",
    marginTop: spacing.md,
    marginBottom: spacing.xl,
    fontWeight: "bold",
  },
  description: {
    color: "#ddd",
    fontSize: 20,
    textAlign: "center",
    lineHeight: 30,
  },
});
