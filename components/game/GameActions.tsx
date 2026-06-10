import { text } from "@/locales/text";
import {
  GamePalette,
  radius,
  sharedStyles,
  spacing
} from "@/style/theme";
import { useLanguageStore } from "@/utils/languageStore";
import { Pressable, StyleSheet, Text, View } from "react-native";

type GameActionsProps = {
  onSkip: () => void;
  onDone: () => void;
  onLike: () => void;
  onDislike: () => void;
  feedbackUsed: boolean;
  palette: GamePalette;
};

export default function GameActions({
  onSkip,
  onDone,
  onLike,
  onDislike,
  feedbackUsed,
  palette,
}: GameActionsProps) {
  const { language, toggleLanguage } = useLanguageStore();
  const t = text[language];
  return (
    <View style={styles.container}>
      <View style={styles.feedbackRow}>
        <Pressable
          style={[
            styles.feedbackButton,
            { borderColor: palette.primary },
            feedbackUsed && styles.disabledButton,
          ]}
          disabled={feedbackUsed}
          onPress={onLike}
        >
          <Text style={[styles.feedbackText, { color: palette.text }]}>
            Like
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.feedbackButton,
            { borderColor: palette.primary },
            feedbackUsed && styles.disabledButton,
          ]}
          disabled={feedbackUsed}
          onPress={onDislike}
        >
          <Text style={[styles.feedbackText, { color: palette.text }]}>
            Dislike
          </Text>
        </Pressable>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={[styles.skipButton, { borderColor: palette.primary }]}
          onPress={onSkip}
        >
          <Text style={[sharedStyles.buttonText, { color: palette.text }]}>
            {t.skipLbl}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.doneButton, { backgroundColor: palette.primary }]}
          onPress={onDone}
        >
          <Text style={[sharedStyles.buttonText, { color: palette.text }]}>
            {t.donelabel}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  feedbackRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  feedbackButton: {
    width: 88,
    backgroundColor: "rgba(0,0,0,0.25)",
    paddingVertical: 9,
    borderRadius: radius.lg,
    alignItems: "center",
    borderWidth: 1,
  },
  feedbackText: {
    fontWeight: "bold",
    fontSize: 13,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  skipButton: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: "center",
    borderWidth: 1,
  },
  doneButton: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.4,
  },
});
