import { colors, radius, sharedStyles, spacing } from "@/style/theme";
import { Pressable, StyleSheet, Text, View } from "react-native";

type GameActionsProps = {
  onSkip: () => void;
  onDone: () => void;
};

export default function GameActions({ onSkip, onDone }: GameActionsProps) {
  return (
    <View style={styles.actions}>
      <Pressable style={styles.skipButton} onPress={onSkip}>
        <Text style={sharedStyles.buttonText}>Skip</Text>
      </Pressable>

      <Pressable style={styles.doneButton} onPress={onDone}>
        <Text style={sharedStyles.buttonText}>Done</Text>
      </Pressable>
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
});
