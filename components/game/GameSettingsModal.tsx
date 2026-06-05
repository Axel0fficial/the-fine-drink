import { router } from "expo-router";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, sharedStyles, spacing } from "@/style/theme";

type GameSettingsModalProps = {
  visible: boolean;
  onClose: () => void;
  roundLimit: number;
  currentRound: number;
};

export default function GameSettingsModal({
  visible,
  onClose,
  roundLimit,
  currentRound,
}: GameSettingsModalProps) {
  function leaveGame() {
    router.replace("/");
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>Game Settings</Text>

          <Text style={styles.infoText}>
            Round {currentRound} of {roundLimit}
          </Text>

          <Pressable style={sharedStyles.primaryButton} onPress={onClose}>
            <Text style={sharedStyles.buttonText}>Resume</Text>
          </Pressable>

          <Pressable style={styles.leaveButton} onPress={leaveGame}>
            <Text style={styles.leaveText}>Leave Game</Text>
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
