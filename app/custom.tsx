import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import CustomChallengeModal from "@/components/custom/CustomChallengeModal";
import { challenges as defaultChallenges } from "@/data/challenges";
import { colors, radius, sharedStyles, spacing } from "@/style/theme";
import { Challenge } from "@/types/game";
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

export default function CustomScreen() {
  const params = useLocalSearchParams();

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

  useEffect(() => {
    async function loadData() {
      const loadedCustomChallenges = await loadCustomChallenges();
      const loadedEnabledSettings = await loadChallengeEnabledSettings();

      setCustomChallenges(loadedCustomChallenges);
      setDefaultChallengeSettings(loadedEnabledSettings);
      setLoaded(true);
    }

    loadData();
  }, []);

  useEffect(() => {
    if (!loaded) return;

    saveCustomChallenges(customChallenges);
    saveChallengeEnabledSettings(defaultChallengeSettings);
  }, [customChallenges, defaultChallengeSettings, loaded]);

  function startCustomGame() {
    router.push({
      pathname: "/game",
      params: {
        players: params.players as string,
        teamsEnabled: params.teamsEnabled as string,
        roundLimit: params.roundLimit as string,
        gameMode: "custom",
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

      <Pressable
        style={[sharedStyles.primaryButton, styles.startButton]}
        onPress={startCustomGame}
      >
        <Text style={sharedStyles.buttonText}>Start Custom Game</Text>
      </Pressable>

      <Pressable
        style={[sharedStyles.secondaryButton, styles.createButton]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={sharedStyles.buttonText}>Create Challenge</Text>
      </Pressable>

      <FlatList
        style={styles.list}
        data={allChallenges}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No challenges available.</Text>
        }
        renderItem={({ item }) => {
          const isCustom = item.tags.includes("custom");

          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.challengeTitle}>{item.title}</Text>

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

              <Text style={styles.description}>{item.description}</Text>

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
        }}
      />

      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>Back</Text>
      </Pressable>

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
});
