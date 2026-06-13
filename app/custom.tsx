import CustomChallengeModal from "@/components/custom/CustomChallengeModal";
import GameModifiersModal from "@/components/custom/GameModifiersModal";
import { challenges as defaultChallenges } from "@/data/challenges";
import { text } from "@/locales/text";
import { colors, radius, sharedStyles, spacing } from "@/style/theme";
import {
  Challenge,
  GameModifierId,
  GameModifierSettings,
  Player,
} from "@/types/game";
import {
  applyChallengeEnabledSettings,
  ChallengeEnabledSetting,
  loadChallengeEnabledSettings,
  saveChallengeEnabledSettings,
} from "@/utils/challengeEnabledStorage";
import {
  loadCustomChallenges,
  saveCustomChallenges,
} from "@/utils/customChallengeStorage";
import {
  loadEnabledGameModifiers,
  loadGameModifierSettings,
  saveEnabledGameModifiers,
  saveGameModifierSettings,
} from "@/utils/gameModifierStorage";
import { useLanguageStore } from "@/utils/languageStore";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

export default function CustomScreen() {
  const { language, toggleLanguage } = useLanguageStore();
  const t = text[language];
  const params = useLocalSearchParams();
  const players: Player[] = JSON.parse((params.players as string) || "[]");
  const [modifierSettings, setModifierSettings] =
    useState<GameModifierSettings>({});
  const [modifierModalVisible, setModifierModalVisible] = useState(false);
  const [enabledModifierIds, setEnabledModifierIds] = useState<
    GameModifierId[]
  >([]);

  const [customChallenges, setCustomChallenges] = useState<Challenge[]>([]);
  const [defaultChallengeSettings, setDefaultChallengeSettings] = useState<
    ChallengeEnabledSetting[]
  >([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const defaultWithSettings = applyChallengeEnabledSettings(
    defaultChallenges,
    defaultChallengeSettings,
  );

  const allChallenges = [...defaultWithSettings, ...customChallenges];
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    simple: true,
    status: false,
    minigame: false,
    custom: false,
  });

  useEffect(() => {
    async function loadData() {
      const loadedCustomChallenges = await loadCustomChallenges();
      const loadedEnabledSettings = await loadChallengeEnabledSettings();
      const loadedModifiers = await loadEnabledGameModifiers();
      const loadedModifierSettings = await loadGameModifierSettings();
      setModifierSettings(loadedModifierSettings);
      setEnabledModifierIds(loadedModifiers);

      setCustomChallenges(loadedCustomChallenges);
      setDefaultChallengeSettings(loadedEnabledSettings);
      setLoaded(true);
    }

    loadData();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    saveEnabledGameModifiers(enabledModifierIds);
    saveGameModifierSettings(modifierSettings);

    saveCustomChallenges(customChallenges);
    saveChallengeEnabledSettings(defaultChallengeSettings);
  }, [
    customChallenges,
    defaultChallengeSettings,
    enabledModifierIds,
    modifierSettings,
    loaded,
  ]);
  const challengeTypes = ["simple", "status", "minigame", "custom"] as const;
  function toggleRiggedPlayer(playerId: string) {
    setModifierSettings((current) => {
      const currentIds = current.riggedForYouPlayerIds ?? [];

      const nextIds = currentIds.includes(playerId)
        ? currentIds.filter((id) => id !== playerId)
        : [...currentIds, playerId];

      return {
        ...current,
        riggedForYouPlayerIds: nextIds,
      };
    });
  }

  function toggleGroup(type: string) {
    setOpenGroups((current) => ({
      ...current,
      [type]: !current[type],
    }));
  }
  function toggleModifier(modifierId: GameModifierId) {
    setEnabledModifierIds((current) => {
      if (current.includes(modifierId)) {
        return current.filter((id) => id !== modifierId);
      }

      return [...current, modifierId];
    });
  }

  function getChallengesByType(type: string) {
    return allChallenges.filter((challenge) => challenge.type === type);
  }

  function setGroupEnabled(type: string, enabled: boolean) {
    const challengesInGroup = getChallengesByType(type);

    challengesInGroup.forEach((challenge) => {
      if (challenge.enabled !== enabled) {
        toggleChallenge(challenge);
      }
    });
  }

  function groupIsEnabled(type: string) {
    const challengesInGroup = getChallengesByType(type);

    if (challengesInGroup.length === 0) return false;

    return challengesInGroup.every((challenge) => challenge.enabled);
  }

  function startCustomGame() {
    router.push({
      pathname: "/game",
      params: {
        players: params.players as string,
        teamsEnabled: params.teamsEnabled as string,
        roundLimit: params.roundLimit as string,
        gameMode: "custom",
        sessionDifficulty: params.sessionDifficulty as string,
        gameModifiers: JSON.stringify(enabledModifierIds),
        gameModifierSettings: JSON.stringify(modifierSettings),
      },
    });
  }

  function addChallenge(challenge: Challenge) {
    setCustomChallenges((current) => [...current, challenge]);
  }

  function toggleChallenge(challenge: Challenge) {
    const isCustom = challenge.tags.includes("custom");

    if (isCustom) {
      setCustomChallenges((current) =>
        current.map((item) =>
          item.id === challenge.id
            ? {
                ...item,
                enabled: !item.enabled,
              }
            : item,
        ),
      );

      return;
    }

    setDefaultChallengeSettings((current) => {
      const existing = current.find((item) => item.id === challenge.id);

      if (existing) {
        return current.map((item) =>
          item.id === challenge.id
            ? {
                ...item,
                enabled: !item.enabled,
              }
            : item,
        );
      }

      return [
        ...current,
        {
          id: challenge.id,
          enabled: !challenge.enabled,
        },
      ];
    });
  }

  function deleteChallenge(challenge: Challenge) {
    if (!challenge.tags.includes("custom")) return;

    setCustomChallenges((current) =>
      current.filter((item) => item.id !== challenge.id),
    );
  }

  return (
    <View style={[sharedStyles.screen, styles.container]}>
      <Text style={sharedStyles.title}>Custom Mode</Text>

      <View style={styles.topActions}>
        <Pressable
          style={[sharedStyles.secondaryButton, styles.topButton]}
          onPress={() => setModifierModalVisible(true)}
        >
          <Text style={sharedStyles.buttonText}>Modifiers</Text>
        </Pressable>

        <Pressable
          style={[sharedStyles.primaryButton, styles.topButton]}
          onPress={startCustomGame}
        >
          <Text style={sharedStyles.buttonText}>Start</Text>
        </Pressable>

        <Pressable
          style={[sharedStyles.secondaryButton, styles.topButton]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={sharedStyles.buttonText}>Create</Text>
        </Pressable>
      </View>

      <FlatList
        style={styles.list}
        data={challengeTypes}
        keyExtractor={(item) => item}
        renderItem={({ item: type }) => {
          const challengesInGroup = getChallengesByType(type);
          const isOpen = openGroups[type];
          const allEnabled = groupIsEnabled(type);

          return (
            <View style={styles.groupBox}>
              <View style={styles.groupHeader}>
                <Pressable
                  style={styles.groupTitleButton}
                  onPress={() => toggleGroup(type)}
                >
                  <Text style={styles.groupTitle}>
                    {isOpen ? "▼" : "▶"} {type.toUpperCase()} (
                    {challengesInGroup.length})
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.groupToggle,
                    allEnabled ? styles.groupToggleOn : styles.groupToggleOff,
                  ]}
                  onPress={() => setGroupEnabled(type, !allEnabled)}
                >
                  <Text style={styles.groupToggleText}>
                    {allEnabled ? "Disable All" : "Enable All"}
                  </Text>
                </Pressable>
              </View>

              {isOpen &&
                challengesInGroup.map((item) => {
                  const isCustom = item.tags.includes("custom");

                  return (
                    <View key={item.id} style={styles.card}>
                      <View style={styles.cardHeader}>
                        <Text style={styles.challengeTitle}>
                          {item.title[language]}
                        </Text>

                        <Pressable
                          style={[
                            styles.enabledPill,
                            !item.enabled && styles.disabledPill,
                          ]}
                          onPress={() => toggleChallenge(item)}
                        >
                          <Text style={styles.pillText}>
                            {item.enabled ? "Enabled" : "Disabled"}
                          </Text>
                        </Pressable>
                      </View>

                      <Text style={styles.description}>
                        {item.description[language]}
                      </Text>

                      <Text style={styles.meta}>
                        {isCustom ? "CUSTOM" : "DEFAULT"} ·{" "}
                        {item.difficulty.toUpperCase()} · {item.tags.join(", ")}
                      </Text>

                      {isCustom && (
                        <Pressable
                          style={styles.deleteButton}
                          onPress={() => deleteChallenge(item)}
                        >
                          <Text style={styles.deleteText}>Delete</Text>
                        </Pressable>
                      )}
                    </View>
                  );
                })}
            </View>
          );
        }}
      />

      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      <GameModifiersModal
        visible={modifierModalVisible}
        enabledModifierIds={enabledModifierIds}
        players={players}
        modifierSettings={modifierSettings}
        onClose={() => setModifierModalVisible(false)}
        onToggle={toggleModifier}
        onToggleRiggedPlayer={toggleRiggedPlayer}
      />

      <CustomChallengeModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={addChallenge}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 70,
  },
  startButton: {
    marginTop: spacing.xl,
  },
  createButton: {
    marginTop: spacing.md,
  },
  list: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  emptyText: {
    color: colors.mutedText,
    textAlign: "center",
    marginTop: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderColor: colors.border,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "center",
  },
  challengeTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  enabledPill: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  disabledPill: {
    backgroundColor: colors.surfaceLight,
  },
  pillText: {
    color: colors.text,
    fontWeight: "bold",
    fontSize: 12,
  },
  description: {
    color: colors.mutedText,
    marginTop: spacing.md,
    lineHeight: 22,
  },
  meta: {
    color: colors.primaryLight,
    marginTop: spacing.md,
    fontWeight: "bold",
    fontSize: 12,
  },
  deleteButton: {
    marginTop: spacing.md,
    alignSelf: "flex-start",
  },
  deleteText: {
    color: "#ff6b6b",
    fontWeight: "bold",
  },
  backButton: {
    alignItems: "center",
    padding: spacing.lg,
  },
  backText: {
    color: colors.mutedText,
    fontWeight: "bold",
  },
  topActions: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.xl,
  },

  topButton: {
    flex: 1,
  },

  groupBox: {
    marginBottom: spacing.lg,
  },

  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderColor: colors.border,
    borderWidth: 1,
  },

  groupTitleButton: {
    flex: 1,
  },

  groupTitle: {
    color: colors.text,
    fontWeight: "bold",
    fontSize: 16,
  },

  groupToggle: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: radius.md,
  },

  groupToggleOn: {
    backgroundColor: "#7a1f1f",
  },

  groupToggleOff: {
    backgroundColor: colors.primary,
  },

  groupToggleText: {
    color: colors.text,
    fontWeight: "bold",
    fontSize: 12,
  },
});
