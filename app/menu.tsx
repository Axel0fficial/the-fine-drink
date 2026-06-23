import DifficultyModal from "@/components/menu/DifficultyModal";
import { text } from "@/locales/text";
import { SessionDifficulty } from "@/types/game";
import { useLanguageStore } from "@/utils/languageStore";
import { saveResponsibleWarningEnabled } from "@/utils/responsibleWarningStorage";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors, radius, spacing } from "@/style/theme";
import { Player } from "@/types/game";
import { loadDrinkyEnabled } from "@/utils/drinkyStorage";

export default function MenuScreen() {
  const params = useLocalSearchParams();
  const { language, toggleLanguage } = useLanguageStore();
  const t = text[language];
  const players: Player[] = JSON.parse((params.players as string) || "[]");
  const teamsEnabled = JSON.parse((params.teamsEnabled as string) || "false");
  const roundLimit = Number(params.roundLimit || 10);
  const [difficultyVisible, setDifficultyVisible] = useState(false);
  const [pendingMode, setPendingMode] = useState<"standard" | "custom" | null>(
    null,
  );

  const [drinkyEnabled, setDrinkyEnabled] = useState(true);
  const hasNonDrinkers = players.some(
    (player) => player.preferences?.nonDrinker,
  );

  useFocusEffect(
    useCallback(() => {
      async function loadSettings() {
        const enabled = await loadDrinkyEnabled();
        setDrinkyEnabled(enabled);
      }

      loadSettings();
    }, []),
  );

  function startGame() {
    router.push({
      pathname: "/game",
      params: {
        players: JSON.stringify(players),
        teamsEnabled: JSON.stringify(teamsEnabled),
        roundLimit: String(roundLimit),
        gameMode: "standard",
      },
    });
  }
  async function startBlackoutMode() {
    if (hasNonDrinkers) return;

    await saveResponsibleWarningEnabled(true);

    router.push({
      pathname: "/game",
      params: {
        players: JSON.stringify(players),
        teamsEnabled: JSON.stringify(teamsEnabled),
        roundLimit: String(roundLimit),
        gameMode: "blackout",
        sessionDifficulty: "chaos",
      },
    });
  }
  function handleDifficultySelect(sessionDifficulty: SessionDifficulty) {
    setDifficultyVisible(false);

    if (pendingMode === "standard") {
      router.push({
        pathname: "/game",
        params: {
          players: JSON.stringify(players),
          teamsEnabled: JSON.stringify(teamsEnabled),
          roundLimit: String(roundLimit),
          gameMode: "standard",
          sessionDifficulty,
        },
      });

      return;
    }

    if (pendingMode === "custom") {
      router.push({
        pathname: "/custom",
        params: {
          players: JSON.stringify(players),
          teamsEnabled: JSON.stringify(teamsEnabled),
          roundLimit: String(roundLimit),
          sessionDifficulty,
        },
      });
    }
  }

  function startCustomMode() {
    router.push({
      pathname: "/custom",
      params: {
        players: JSON.stringify(players),
        teamsEnabled: JSON.stringify(teamsEnabled),
        roundLimit: String(roundLimit),
      },
    });
  }

  const backgroundImage = drinkyEnabled
    ? require("@/assets/images/chibi.png")
    : require("@/assets/images/out.png");

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.topRow}>
          <Pressable
            style={styles.settingsButton}
            onPress={() => router.push("/settings")}
          >
            <Text style={styles.settingsText}>⚙</Text>
          </Pressable>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>The Fine Drink</Text>

          <Text style={styles.subtitle}>
            {players.length} {t.playerslabel} · {roundLimit} {t.roundLabel} ·{" "}
            {t.TeamsButtonText} {teamsEnabled ? "On" : "Off"}
          </Text>

          <View style={styles.gameModes}>
            <Text style={styles.sectionLabel}>{t.gamemodeslabel}</Text>

            <Pressable
              style={styles.primaryModeButton}
              onPress={() => {
                setPendingMode("standard");
                setDifficultyVisible(true);
              }}
            >
              <Text style={styles.primaryModeText}>Standard Play</Text>
              <Text style={styles.modeDescription}>
                Default chaos. No questions asked.
              </Text>
            </Pressable>

            <Pressable
              style={styles.modeButton}
              onPress={() => {
                setPendingMode("custom");
                setDifficultyVisible(true);
              }}
            >
              <Text style={styles.modeText}>Custom Play</Text>
              <Text style={styles.modeDescription}>
                Use custom challenges and toggle the list.
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.modeButton,
                styles.actionButton,
                hasNonDrinkers && styles.disabledModeButton,
              ]}
              disabled={hasNonDrinkers}
              onPress={startBlackoutMode}
            >
              <Text style={styles.modeText}>Blackout</Text>
              <Text style={styles.modeDescription}>
                Drinking-only chaos. No non-drinkers allowed.
              </Text>

              {hasNonDrinkers && (
                <Text style={styles.disabledReason}>
                  Disabled because a non-drinker is in the session.
                </Text>
              )}
            </Pressable>
          </View>
        </View>

        <Pressable
          style={styles.editPlayersButton}
          onPress={() => router.back()}
        >
          <Text style={styles.editPlayersText}>{t.BackText}</Text>
        </Pressable>
        <DifficultyModal
          visible={difficultyVisible}
          onClose={() => setDifficultyVisible(false)}
          onSelect={handleDifficultySelect}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.42)",
    padding: spacing.xl,
    paddingTop: 58,
  },
  actionButton: {
    marginTop: spacing.lg,
  },
  topRow: {
    alignItems: "flex-end",
  },
  settingsButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderColor: colors.primaryLight,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  settingsText: {
    color: colors.text,
    fontSize: 22,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  title: {
    color: colors.text,
    fontSize: 42,
    fontWeight: "bold",
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.mutedText,
    fontSize: 15,
    marginBottom: spacing.xxl,
  },
  gameModes: {
    width: "100%",
    alignItems: "flex-start",
  },
  sectionLabel: {
    color: colors.primaryLight,
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: spacing.md,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  disabledModeButton: {
    opacity: 0.45,
  },

  disabledReason: {
    color: "#ff9f9f",
    marginTop: 6,
    fontSize: 12,
    fontWeight: "bold",
  },
  primaryModeButton: {
    width: "78%",
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  primaryModeText: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "bold",
  },
  modeButton: {
    width: "78%",
    backgroundColor: "rgba(0,0,0,0.55)",
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.xl,
    padding: spacing.lg,
  },
  modeText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "bold",
  },
  modeDescription: {
    color: colors.mutedText,
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
  },
  editPlayersButton: {
    alignSelf: "center",
    padding: spacing.lg,
  },
  editPlayersText: {
    color: colors.mutedText,
    fontWeight: "bold",
    fontSize: 16,
  },
});
