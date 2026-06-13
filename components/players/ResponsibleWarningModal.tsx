import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, sharedStyles, spacing } from "@/style/theme";

type ResponsibleWarningModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function ResponsibleWarningModal({
  visible,
  onClose,
}: ResponsibleWarningModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>Play Responsibly</Text>

          <Text style={styles.text}>
            This game is meant for laughs, hanging out, and having a good time.
            Do not overdo it, respect everyone&apos;s limits, and never pressure
            anyone to drink.
          </Text>

          <Text style={styles.text}>
            If someone wants to skip, slow down, or stop playing, let them. The
            fun part is the chaos — not making anyone uncomfortable.
          </Text>

          <Pressable style={sharedStyles.primaryButton} onPress={onClose}>
            <Text style={sharedStyles.buttonText}>I Understand</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.78)",
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
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  text: {
    color: colors.mutedText,
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
});
