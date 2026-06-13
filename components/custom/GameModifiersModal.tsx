import { gameModifiers } from "@/data/gameModifiers";
import { text } from "@/locales/text";
import { colors, radius, sharedStyles, spacing } from "@/style/theme";
import { GameModifierId, GameModifierSettings, Player } from "@/types/game";
import { useLanguageStore } from "@/utils/languageStore";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type GameModifiersModalProps = {
  visible: boolean;
  enabledModifierIds: GameModifierId[];
  players: Player[];
  modifierSettings: GameModifierSettings;
  onClose: () => void;
  onToggle: (modifierId: GameModifierId) => void;
  onToggleRiggedPlayer: (playerId: string) => void;
};

export default function GameModifiersModal({
  visible,
  enabledModifierIds,
  players,
  modifierSettings,
  onClose,
  onToggle,
  onToggleRiggedPlayer,
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

                {modifier.id === "riggedForYou" && enabled && (
                  <View style={styles.playerList}>
                    {players.map((player) => {
                      const selected =
                        modifierSettings.riggedForYouPlayerIds?.includes(
                          player.id,
                        ) ?? false;

                      return (
                        <Pressable
                          key={player.id}
                          style={[
                            styles.playerPill,
                            selected && styles.playerPillSelected,
                          ]}
                          onPress={(event) => {
                            event.stopPropagation();
                            onToggleRiggedPlayer(player.id);
                          }}
                        >
                          <Text style={styles.playerPillText}>
                            {selected ? "✓ " : ""}
                            {player.name}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                )}
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
  playerList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.md,
  },

  playerPill: {
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: radius.md,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },

  playerPillSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.text,
  },

  playerPillText: {
    color: colors.text,
    fontWeight: "bold",
    fontSize: 12,
  },
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
