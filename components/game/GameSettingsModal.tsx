import { text } from "@/locales/text";
import {
  colors,
  GamePalette,
  radius,
  sharedStyles,
  spacing,
} from "@/style/theme";
import { useLanguageStore } from "@/utils/languageStore";
import { router } from "expo-router";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type GameSettingsModalProps = {
  visible: boolean;
  onClose: () => void;
  roundLimit: number;
  currentRound: number;
  palette: GamePalette;
};

export default function GameSettingsModal({
  visible,
  onClose,
  roundLimit,
  palette,
  currentRound,
}: GameSettingsModalProps) {
  const { language, toggleLanguage } = useLanguageStore();
  const t = text[language];
  function leaveGame() {
    router.replace("/");
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.modalBox, { borderColor: palette.primary }]}>
          <Text style={[styles.title, { color: palette.text }]}>
            {t.gamesettingLbl}
          </Text>

          <Text style={styles.infoText}>
            {t.roundLbl} {currentRound} {t.ofLbl} {roundLimit}
          </Text>

          <Pressable
            style={[
              sharedStyles.primaryButton,
              { backgroundColor: palette.primary },
            ]}
            onPress={onClose}
          >
            <Text style={sharedStyles.buttonText}>{t.resumeLbl}</Text>
          </Pressable>

          <Pressable style={styles.leaveButton} onPress={leaveGame}>
            <Text style={styles.leaveText}>{t.LeaveGameLbl}</Text>
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
    borderWidth: 1,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  infoText: {
    color: colors.mutedText,
    textAlign: "center",
    marginBottom: spacing.xl,
    fontSize: 16,
  },
  leaveButton: {
    marginTop: spacing.lg,
    alignItems: "center",
  },
  leaveText: {
    color: "#ff6b6b",
    fontWeight: "bold",
    fontSize: 16,
  },
});
