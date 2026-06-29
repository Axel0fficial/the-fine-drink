import ErrorReportModal from "@/components/settings/ErrorReprtModal";
import { text } from "@/locales/text";
import { colors, radius, sharedStyles, spacing } from "@/style/theme";
import {
  exportCustomChallenges,
  importCustomChallenges,
} from "@/utils/customChallengeBackup";
import { loadDrinkyEnabled, saveDrinkyEnabled } from "@/utils/drinkyStorage";
import { sendGameDataExport } from "@/utils/gameDataExport";
import { useLanguageStore } from "@/utils/languageStore";
import { clearSavedPlayers } from "@/utils/playerStorage";
import {
  loadResponsibleWarningEnabled,
  saveResponsibleWarningEnabled,
} from "@/utils/responsibleWarningStorage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SettingsScreen() {
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [drinkyEnabled, setDrinkyEnabled] = useState(true);
  const { language, toggleLanguage } = useLanguageStore();
  const [responsibleWarningEnabled, setResponsibleWarningEnabled] =
    useState(true);
  const t = text[language];
  const [sendingGameData, setSendingGameData] = useState(false);
  const [errorReportVisible, setErrorReportVisible] = useState(false);
  useEffect(() => {
    async function loadSettings() {
      const warningEnabled = await loadResponsibleWarningEnabled();
      setResponsibleWarningEnabled(warningEnabled);
    }

    loadSettings();
  }, []);
  useEffect(() => {
    async function loadSettings() {
      const enabled = await loadDrinkyEnabled();
      setDrinkyEnabled(enabled);
    }

    loadSettings();
  }, []);

  async function toggleDrinky(value: boolean) {
    setDrinkyEnabled(value);
    await saveDrinkyEnabled(value);
  }

  async function handleErasePlayers() {
    await clearSavedPlayers();
    setConfirmVisible(false);
  }
  async function handleExportCustomChallenges() {
    try {
      const count = await exportCustomChallenges();

      Alert.alert(
        "Export Complete",
        `Exported ${count} custom challenge${count === 1 ? "" : "s"}.`,
      );
    } catch (error) {
      console.log(error);
      Alert.alert("Export Failed", "Could not export custom challenges.");
    }
  }

  async function handleImportCustomChallenges() {
    try {
      const count = await importCustomChallenges();

      if (count === null) return;

      Alert.alert(
        "Import Complete",
        `Imported ${count} custom challenge${count === 1 ? "" : "s"}.`,
      );
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Import Failed",
        "The selected file is not a valid custom challenge backup.",
      );
    }
  }
  async function handleSendGameData() {
    if (sendingGameData) return;

    Alert.alert(
      "Send Game Data?",
      "This will send anonymous challenge preference data: challenge IDs, favorites, likes, dislikes, and the number of custom challenges created. It will not send player names or game sessions.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Send",
          onPress: async () => {
            try {
              setSendingGameData(true);

              const payload = await sendGameDataExport();

              Alert.alert(
                "Data Sent",
                `Thanks! Sent ${payload.challenges.length} challenge records and ${payload.customChallengeCount} custom challenge count.`,
              );
            } catch (error) {
              Alert.alert(
                "Send Failed",
                "The game data could not be sent. Please check your connection or endpoint.",
              );

              console.log(error);
            } finally {
              setSendingGameData(false);
            }
          },
        },
      ],
    );
  }
  async function toggleResponsibleWarning(value: boolean) {
    setResponsibleWarningEnabled(value);
    await saveResponsibleWarningEnabled(value);
  }

  return (
    <View style={[sharedStyles.screen, styles.container]}>
      <Text style={sharedStyles.title}>{t.settingsTitle}</Text>

      <View style={styles.settingRow}>
        <View style={styles.settingTextBox}>
          <Text style={styles.settingTitle}>Drinky</Text>
          <Text style={styles.settingSubtitle}>{t.Drinkyavailability}</Text>
        </View>

        <Switch value={drinkyEnabled} onValueChange={toggleDrinky} />
      </View>

      <View style={styles.settingRow}>
        <View style={styles.settingTextBox}>
          <Text style={styles.settingTitle}>Responsible Play Warning</Text>
          <Text style={styles.settingSubtitle}>
            Show the drinking responsibility message when entering the player
            screen.
          </Text>
        </View>

        <Switch
          value={responsibleWarningEnabled}
          onValueChange={toggleResponsibleWarning}
        />
      </View>

      <Pressable
        style={[
          sharedStyles.secondaryButton,
          styles.actionButton,
          sendingGameData && styles.disabledButton,
        ]}
        disabled={sendingGameData}
        onPress={handleSendGameData}
      >
        <Text style={sharedStyles.buttonText}>
          {sendingGameData ? "Sending..." : "Send Game Data"}
        </Text>
      </Pressable>
      <Pressable
        style={[sharedStyles.secondaryButton, styles.actionButton]}
        onPress={() => setErrorReportVisible(true)}
      >
        <Text style={sharedStyles.buttonText}>Report Error</Text>
      </Pressable>

      <Pressable
        style={[sharedStyles.secondaryButton, styles.settingSubtitle]}
        onPress={handleExportCustomChallenges}
      >
        <Text style={sharedStyles.buttonText}>Export Challenges</Text>
      </Pressable>

      <Pressable
        style={[sharedStyles.secondaryButton, styles.settingSubtitle]}
        onPress={handleImportCustomChallenges}
      >
        <Text style={sharedStyles.buttonText}>Import Challenges</Text>
      </Pressable>

      <Pressable
        style={sharedStyles.secondaryButton}
        onPress={() => router.push("/how-to")}
      >
        <Text style={sharedStyles.buttonText}>How To</Text>
      </Pressable>

      <TouchableOpacity onPress={toggleLanguage} style={styles.languageButton}>
        <Text style={styles.languageButtonText}>
          🌎 {t.languageButton}: {language.toUpperCase()}
        </Text>
      </TouchableOpacity>
      <Pressable
        style={styles.dangerButton}
        onPress={() => setConfirmVisible(true)}
      >
        <Text style={styles.dangerText}>{t.PlayerErasure}</Text>
      </Pressable>

      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>{t.BackText}</Text>
      </Pressable>

      <Modal visible={confirmVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{t.PlayerErasureConfirmation}</Text>

            <Text style={styles.modalText}>{t.PlayerErasureWarning}</Text>

            <View style={styles.actions}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setConfirmVisible(false)}
              >
                <Text style={sharedStyles.buttonText}>{t.CancelText}</Text>
              </Pressable>

              <Pressable
                style={styles.confirmButton}
                onPress={handleErasePlayers}
              >
                <Text style={sharedStyles.buttonText}>
                  {t.EraseButtonSettings}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <ErrorReportModal
        visible={errorReportVisible}
        onClose={() => setErrorReportVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 70,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  languageButton: {
    backgroundColor: "#6d00b6",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ffffff20",
  },
  actionButton: {
    marginTop: spacing.lg,
  },
  languageButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  settingTextBox: {
    flex: 1,
  },
  settingTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "bold",
  },
  settingSubtitle: {
    color: colors.mutedText,
    marginTop: 4,
  },
  dangerButton: {
    backgroundColor: "#7a1f1f",
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: "center",
    marginTop: spacing.xl,
  },
  dangerText: {
    color: colors.text,
    fontWeight: "bold",
    fontSize: 16,
  },
  backButton: {
    marginTop: spacing.lg,
    alignItems: "center",
    padding: spacing.lg,
  },
  backText: {
    color: colors.mutedText,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.5,
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
    borderColor: "#ff6b6b",
    borderWidth: 1,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: spacing.md,
  },
  modalText: {
    color: colors.mutedText,
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: "center",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#7a1f1f",
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: "center",
  },
});
