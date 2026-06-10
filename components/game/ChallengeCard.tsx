import { text } from "@/locales/text";
import { colors, radius, spacing } from "@/style/theme";
import { Challenge } from "@/types/game";
import { useLanguageStore } from "@/utils/languageStore";
import { Pressable, StyleSheet, Text, View } from "react-native";

type ChallengeCardProps = {
  challenge: Challenge;
  onToggleFavorite?: () => void;
  palette?: {
    background: string;
    primary: string;
    accent: string;
    text: string;
  };
};
export default function ChallengeCard({
  challenge,
  onToggleFavorite,
  palette,
}: ChallengeCardProps) {
  const { language, toggleLanguage } = useLanguageStore();
  const t = text[language];
  return (
    <View
      style={[
        styles.card,
        palette && {
          borderColor: palette.primary,
          backgroundColor: palette.background,
        },
      ]}
    >
      <Pressable style={styles.favoriteButton} onPress={onToggleFavorite}>
        <Text
          style={[styles.favoriteText, palette && { color: palette.accent }]}
        >
          {challenge.isFavorite ? "★ Favorite" : "☆ Favorite"}
        </Text>
      </Pressable>
      <Text style={[styles.title, palette && { color: palette.text }]}>
        {challenge.title}
      </Text>

      <Text style={[styles.difficulty, palette && { color: palette.accent }]}>
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

  favoriteButton: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
  },
  favoriteText: {
    color: colors.primaryLight,
    fontWeight: "bold",
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
