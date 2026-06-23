import { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { colors, radius, sharedStyles, spacing } from "@/style/theme";
import { sendErrorReport } from "@/utils/errorReportExport";

type ErrorReportModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function ErrorReportModal({
  visible,
  onClose,
}: ErrorReportModalProps) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsVisible, setTermsVisible] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSend() {
    if (!name.trim()) {
      Alert.alert("Missing name", "Please enter your name.");
      return;
    }

    if (!message.trim()) {
      Alert.alert("Missing report", "Please describe the error.");
      return;
    }

    if (!acceptedTerms) {
      Alert.alert("Terms required", "Please accept the terms and conditions.");
      return;
    }

    try {
      setSending(true);

      await sendErrorReport({
        name: name.trim(),
        message: message.trim(),
        email: email.trim() || undefined,
      });

      Alert.alert("Report sent", "Thank you. The error report was sent.");

      setName("");
      setMessage("");
      setEmail("");
      setAcceptedTerms(false);
      onClose();
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Send failed",
        "The report could not be sent. Please check your connection or endpoint.",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <Text style={styles.title}>Report an Error</Text>

            <TextInput
              style={styles.input}
              placeholder="Your name"
              placeholderTextColor={colors.mutedText}
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={[styles.input, styles.messageInput]}
              placeholder="What went wrong?"
              placeholderTextColor={colors.mutedText}
              value={message}
              onChangeText={setMessage}
              multiline
            />

            <TextInput
              style={styles.input}
              placeholder="Email optional"
              placeholderTextColor={colors.mutedText}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.termsRow}>
              <Pressable
                style={[
                  styles.checkbox,
                  acceptedTerms && styles.checkboxChecked,
                ]}
                onPress={() => setAcceptedTerms((current) => !current)}
              >
                <Text style={styles.checkboxText}>
                  {acceptedTerms ? "✓" : ""}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setTermsVisible(true)}
                style={{ flex: 1 }}
              >
                <Text style={styles.termsText}>
                  I agree to the terms and conditions.
                </Text>
              </Pressable>
            </View>

            <Pressable
              style={[
                sharedStyles.primaryButton,
                sending && styles.disabledButton,
              ]}
              disabled={sending}
              onPress={handleSend}
            >
              <Text style={sharedStyles.buttonText}>
                {sending ? "Sending..." : "Send Report"}
              </Text>
            </Pressable>

            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal visible={termsVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <Text style={styles.title}>Terms & Privacy</Text>

            <ScrollView style={styles.termsBox}>
              <Text style={styles.privacyText}>
                This error report is sent only when you press Send Report.
              </Text>

              <Text style={styles.privacyText}>
                The data sent is: your name, optional email, your error message,
                custom challenges created on this device, and an anonymous
                device ID used to group future reports from the same
                installation.
              </Text>

              <Text style={styles.privacyText}>
                Challenge preference data is sent separately as anonymous game
                data when you submit a report, using the same anonymous device
                ID.
              </Text>

              <Text style={styles.privacyText}>
                Challenge preference data includes challenge ID, favorite state,
                likes, and dislikes.
              </Text>

              <Text style={styles.privacyText}>
                This report is used only to understand and fix errors. Your data
                will remain private and will not be sold or shared publicly.
              </Text>
            </ScrollView>

            <Pressable
              style={sharedStyles.primaryButton}
              onPress={() => setTermsVisible(false)}
            >
              <Text style={sharedStyles.buttonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
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
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  input: {
    backgroundColor: colors.surfaceLight,
    color: colors.text,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderColor: colors.border,
    borderWidth: 1,
  },
  messageInput: {
    minHeight: 110,
    textAlignVertical: "top",
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  checkboxText: {
    color: colors.text,
    fontWeight: "bold",
  },
  termsText: {
    color: colors.primaryLight,
    fontWeight: "bold",
  },
  cancelButton: {
    alignItems: "center",
    padding: spacing.lg,
  },
  cancelText: {
    color: colors.mutedText,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.5,
  },
  termsBox: {
    maxHeight: 280,
    marginBottom: spacing.lg,
  },
  privacyText: {
    color: colors.mutedText,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
});
