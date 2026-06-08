import { useState } from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { colors, radius, sharedStyles, spacing } from "@/style/theme";
import { Challenge, ChallengeTag, Difficulty } from "@/types/game";

type CustomChallengeModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (challenge: Challenge) => void;
};

const difficulties: Difficulty[] = ["easy", "normal", "hard", "brutal"];

const selectableTags: ChallengeTag[] = ["drinking", "nonDrinkerSafe", "teams"];

export default function CustomChallengeModal({
  visible,
  onClose,
  onSave,
}: CustomChallengeModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [tags, setTags] = useState<ChallengeTag[]>(["nonDrinkerSafe"]);

  function toggleTag(tag: ChallengeTag) {
    setTags((current) => {
      if (current.includes(tag)) {
        return current.filter((item) => item !== tag);
      }

      return [...current, tag];
    });
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setDifficulty("easy");
    setTags(["nonDrinkerSafe"]);
  }

  function handleSave() {
    const cleanTitle = title.trim();
    const cleanDescription = description.trim();

    if (!cleanTitle || !cleanDescription) return;

    const newChallenge: Challenge = {
      id: `custom-${Date.now()}`,
      type: "custom",
      title: cleanTitle,
      description: cleanDescription,
      difficulty,
      tags: Array.from(new Set([...tags, "custom"])),
      enabled: true,
      baseChance: 1,
      minChance: 0.2,
      maxChance: 2,
      isFavorite: false,
      likes: 0,
      dislikes: 0,
    };

    onSave(newChallenge);
    resetForm();
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>Create Challenge</Text>

          <TextInput
            style={sharedStyles.input}
            placeholder="Challenge name"
            placeholderTextColor={colors.darkMutedText}
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            style={[sharedStyles.input, styles.descriptionInput]}
            placeholder="Description"
            placeholderTextColor={colors.darkMutedText}
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <Text style={styles.sectionTitle}>Difficulty</Text>

          <View style={styles.optionRow}>
            {difficulties.map((item) => (
              <Pressable
                key={item}
                style={[
                  styles.optionButton,
                  difficulty === item && styles.selectedOption,
                ]}
                onPress={() => setDifficulty(item)}
              >
                <Text style={styles.optionText}>{item}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Tags</Text>

          <View style={styles.optionRow}>
            {selectableTags.map((tag) => (
              <Pressable
                key={tag}
                style={[
                  styles.optionButton,
                  tags.includes(tag) && styles.selectedOption,
                ]}
                onPress={() => toggleTag(tag)}
              >
                <Text style={styles.optionText}>{tag}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.actions}>
            <Pressable style={styles.secondaryButton} onPress={onClose}>
              <Text style={sharedStyles.buttonText}>Cancel</Text>
            </Pressable>

            <Pressable style={styles.primaryButton} onPress={handleSave}>
              <Text style={sharedStyles.buttonText}>Save</Text>
            </Pressable>
          </View>
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
  descriptionInput: {
    marginTop: spacing.md,
    minHeight: 90,
    textAlignVertical: "top",
  },
  sectionTitle: {
    color: colors.mutedText,
    fontWeight: "bold",
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  optionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  optionButton: {
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedOption: {
    borderColor: colors.primaryLight,
    backgroundColor: colors.primary,
  },
  optionText: {
    color: colors.text,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: "center",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: "center",
  },
});
