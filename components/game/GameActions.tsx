import { colors, radius, sharedStyles, spacing } from "@/style/theme";
import { Pressable, StyleSheet, Text, View } from "react-native";

type GameActionsProps = {
  onSkip: () => void;
  onDone: () => void;
  onLike: () => void;
  onDislike: () => void;
  feedbackUsed: boolean;
};

export default function GameActions({
  onSkip,
  onDone,
  onDislike,
  onLike,
  feedbackUsed,
}: GameActionsProps) {
  return (
    <View style={styles.actions}>
      <Pressable style={styles.skipButton} onPress={onSkip}>
        <Text style={sharedStyles.buttonText}>Skip</Text>
      </Pressable>

      <Pressable style={styles.doneButton} onPress={onDone}>
        <Text style={sharedStyles.buttonText}>Done</Text>
      </Pressable>
      <View style={styles.feedbackRow}>
        <Pressable
          style={[styles.feedbackButton, feedbackUsed && styles.disabledButton]}
          disabled={feedbackUsed}
          onPress={onLike}
        >
          <Text style={styles.feedbackText}>Like</Text>
        </Pressable>

        <Pressable
          style={[styles.feedbackButton, feedbackUsed && styles.disabledButton]}
          disabled={feedbackUsed}
          onPress={onDislike}
        >
          <Text style={styles.feedbackText}>Dislike</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: 32,
  },
  skipButton: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: "center",
  },
  doneButton: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: "center",
  },
  feedbackRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  feedbackButton: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.lg,
    alignItems: "center",
    borderColor: colors.border,
    borderWidth: 1,
  },
  feedbackText: {
    color: colors.text,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.4,
  },
});
