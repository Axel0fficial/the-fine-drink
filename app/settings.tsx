import { text } from "@/locales/text";
import { colors, radius, sharedStyles, spacing } from "@/style/theme";
import { loadDrinkyEnabled, saveDrinkyEnabled } from "@/utils/drinkyStorage";
import { useLanguageStore } from "@/utils/languageStore";
import { clearSavedPlayers } from "@/utils/playerStorage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
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
  const t = text[language];
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

  return (
    <View style={[sharedStyles.screen, styles.container]}>
      <Text style={sharedStyles.title}>{t.settingsTitle}</Text>

      <View style={styles.settingRow}>
        <View style={styles.settingTextBox}>
          <Text style={styles.settingTitle}>Drinky</Text>
          <Text style={styles.settingSubtitle}>
            {t.Drinkyavailability}
          </Text>
        </View>

        <Switch value={drinkyEnabled} onValueChange={toggleDrinky} />
      </View>
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

            <Text style={styles.modalText}>
              {t.PlayerErasureWarning}
            </Text>

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
                <Text style={sharedStyles.buttonText}>{t.EraseButtonSettings}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
