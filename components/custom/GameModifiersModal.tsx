import { gameModifiers } from "@/data/gameModifiers";
import { text } from "@/locales/text";
import { colors, radius, sharedStyles, spacing } from "@/style/theme";
import { GameModifierId } from "@/types/game";
import { useLanguageStore } from "@/utils/languageStore";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type GameModifiersModalProps = {
  visible: boolean;
  enabledModifierIds: GameModifierId[];
  onClose: () => void;
  onToggle: (modifierId: GameModifierId) => void;
};

export default function GameModifiersModal({
  visible,
  enabledModifierIds,
  onClose,
  onToggle,
}: GameModifiersModalProps) {
  const { language, toggleLanguage } = useLanguageStore();
  const t = text[language];
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>Game Modifiers</Text>

          {gameModifiers.map((modifier) => {
            const enabled = enabledModifierIds.includes(modifier.id);

            return (
              <Pressable
                key={modifier.id}
                style={[
                  styles.modifierCard,
                  enabled && styles.modifierCardEnabled,
                ]}
                onPress={() => onToggle(modifier.id)}
              >
                <View style={styles.modifierHeader}>
                  <Text style={styles.modifierName}>{modifier.name}</Text>

                  <Text style={styles.modifierState}>
                    {enabled ? "On" : "Off"}
                  </Text>
                </View>

                <Text style={styles.modifierDescription}>
                  {modifier.description}
                </Text>
              </Pressable>
            );
          })}

          <Pressable style={sharedStyles.primaryButton} onPress={onClose}>
            <Text style={sharedStyles.buttonText}>{t.donelabel}</Text>
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
  modifierCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modifierCardEnabled: {
    borderColor: colors.primaryLight,
    backgroundColor: colors.primary,
  },
  modifierHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  modifierName: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  modifierState: {
    color: colors.text,
    fontWeight: "bold",
  },
  modifierDescription: {
    color: colors.mutedText,
    marginTop: spacing.sm,
    lineHeight: 20,
  },
});
