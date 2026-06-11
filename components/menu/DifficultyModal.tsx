import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/style/theme";
import { SessionDifficulty } from "@/types/game";

type DifficultyModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (difficulty: SessionDifficulty) => void;
};

const difficulties: {
  id: SessionDifficulty;
  title: string;
  description: string;
}[] = [
  {
    id: "chill",
    title: "Chill",
    description: "Mostly easy challenges.",
  },
  {
    id: "normal",
    title: "Normal",
    description: "Balanced chaos.",
  },
  {
    id: "spicy",
    title: "Spicy",
    description: "Harder challenges appear more often.",
  },
  {
    id: "chaos",
    title: "Chaos",
    description: "Brutal challenges are invited to the party.",
  },
];

export default function DifficultyModal({
  visible,
  onClose,
  onSelect,
}: DifficultyModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>Select Difficulty</Text>

          {difficulties.map((difficulty) => (
            <Pressable
              key={difficulty.id}
              style={styles.option}
              onPress={() => onSelect(difficulty.id)}
            >
              <Text style={styles.optionTitle}>{difficulty.title}</Text>
              <Text style={styles.optionDescription}>
                {difficulty.description}
              </Text>
            </Pressable>
          ))}

          <Pressable style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
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
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  option: {
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderColor: colors.border,
    borderWidth: 1,
  },
  optionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "bold",
  },
  optionDescription: {
    color: colors.mutedText,
    marginTop: 4,
  },
  cancelButton: {
    alignItems: "center",
    padding: spacing.lg,
  },
  cancelText: {
    color: colors.mutedText,
    fontWeight: "bold",
  },
});
