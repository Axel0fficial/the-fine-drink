import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

import { COLORS, sharedStyles } from "../app/sharedStyles";
import ScreenContainer from "../src/components/ScreenContainer";
import { useGameStore } from "../src/state/gameStore";
import type { Challenge } from "../src/types/game";

type Difficulty = "easy" | "normal" | "hard" | "brutal";

const ALL_CATEGORIES = [
  "individual",
  "group",
  "quantity",
  "status",
  "timed",
  "reaction",
  "social",
  "drinking",
];

function createCustomChallenge(input: {
  title: string;
  description: string;
  difficulty: Difficulty;
  categories: string[];
}): Challenge {
  return {
    id: `custom_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    title: input.title,
    description: input.description,
    difficulty: input.difficulty,
    categories: input.categories,
    points: 2,
    baseChance: 0.4,
    minChance: 0.2,
    maxChance: 0.6,
    cooldownTurns: 3,
    isUnique: false,
    isFavorite: false,
    isCustom: true,
    enabled: true,
    logicType: "none",
  };
}

function getChallengeGroupLabel(challenge: Challenge): string {
  if (challenge.presentationType === "minigame") return "Minigames";
  if (challenge.logicType === "status_effect") return "Status Challenges";
  if (challenge.logicType === "pool_prompt") return "Prompt Challenges";
  if (challenge.logicType === "range") return "Variable Challenges";
  if (challenge.logicType === "timer") return "Timed Challenges";
  return "Standard Challenges";
}

export default function Custom1Screen() {
  const {
    challenges,
    customModeEnabledCategories,
    customModeDisabledChallengeIds,
    globallyDisabledChallengeIds,
    setChallenges,
    setCustomModeEnabledCategories,
    setCustomModeDisabledChallengeIds,
  } = useGameStore();

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDifficulty, setNewDifficulty] = useState<Difficulty>("normal");
  const [newCategories, setNewCategories] = useState<string[]>([]);

  const [collapsedGroups, setCollapsedGroups] = useState<
    Record<string, boolean>
  >({
    Minigames: false,
    "Status Challenges": false,
    "Prompt Challenges": false,
    "Variable Challenges": false,
    "Timed Challenges": false,
    "Standard Challenges": false,
  });

  const [enabledGroups, setEnabledGroups] = useState<Record<string, boolean>>({
    Minigames: true,
    "Status Challenges": true,
    "Prompt Challenges": true,
    "Variable Challenges": true,
    "Timed Challenges": true,
    "Standard Challenges": true,
  });

  const visibleChallenges = useMemo(() => {
    return challenges.filter((challenge) =>
      challenge.categories.some((category) =>
        customModeEnabledCategories.includes(category),
      ),
    );
  }, [challenges, customModeEnabledCategories]);

  const groupedChallenges = useMemo(() => {
    const groups: Record<string, Challenge[]> = {};

    for (const challenge of visibleChallenges) {
      const group = getChallengeGroupLabel(challenge);

      if (!groups[group]) {
        groups[group] = [];
      }

      groups[group].push(challenge);
    }

    return groups;
  }, [visibleChallenges]);

  const toggleGroupCollapsed = (groupName: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const toggleGroupEnabled = (groupName: string) => {
    setEnabledGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const toggleChallengeEnabled = (challengeId: string) => {
    setCustomModeDisabledChallengeIds((prev) =>
      prev.includes(challengeId)
        ? prev.filter((id) => id !== challengeId)
        : [...prev, challengeId],
    );
  };

  const toggleCategory = (category: string) => {
    setCustomModeEnabledCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category],
    );
  };

  const toggleNewCategory = (category: string) => {
    setNewCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category],
    );
  };

  const deleteCustomChallenge = (challengeId: string) => {
    setChallenges((prev) =>
      prev.filter(
        (challenge) => !(challenge.id === challengeId && challenge.isCustom),
      ),
    );

    setCustomModeDisabledChallengeIds((prev) =>
      prev.filter((id) => id !== challengeId),
    );
  };

  const handleCreateChallenge = () => {
    const cleanTitle = newTitle.trim();
    const cleanDescription = newDescription.trim();

    if (!cleanTitle) {
      Alert.alert(
        "Missing title",
        "Please add a title for the custom challenge.",
      );
      return;
    }

    if (!cleanDescription) {
      Alert.alert(
        "Missing description",
        "Please add a description for the custom challenge.",
      );
      return;
    }

    if (newCategories.length === 0) {
      Alert.alert("Missing category", "Select at least one category.");
      return;
    }

    const challenge = createCustomChallenge({
      title: cleanTitle,
      description: cleanDescription,
      difficulty: newDifficulty,
      categories: newCategories,
    });

    setChallenges((prev) => [challenge, ...prev]);

    setNewTitle("");
    setNewDescription("");
    setNewDifficulty("normal");
    setNewCategories([]);
    setCreateModalVisible(false);
  };

  const renderChallengeItem = ({ item }: { item: Challenge }) => {
    const isGloballyDisabled = globallyDisabledChallengeIds.includes(item.id);
    const isDisabledForCustom = customModeDisabledChallengeIds.includes(
      item.id,
    );
    const isEnabledForCustom = !isDisabledForCustom && !isGloballyDisabled;

    return (
      <View
        style={[
          styles.challengeCard,
          isGloballyDisabled && styles.challengeCardGloballyDisabled,
        ]}
      >
        <View style={styles.challengeHeader}>
          <View style={styles.challengeHeaderText}>
            <Text style={styles.challengeTitle}>{item.title}</Text>
            <Text style={styles.challengeMeta}>
              {item.difficulty.toUpperCase()} • {item.categories.join(", ")}
            </Text>
          </View>

          <Switch
            value={isEnabledForCustom}
            onValueChange={() => toggleChallengeEnabled(item.id)}
            disabled={isGloballyDisabled}
            trackColor={{ false: "#2a2a2a", true: COLORS.purpleDark }}
            thumbColor="#ffffff"
          />
        </View>

        <Text style={styles.challengeDescription}>{item.description}</Text>

        <View style={styles.challengeFooter}>
          {item.isCustom && (
            <Pressable
              style={sharedStyles.dangerButton}
              onPress={() => deleteCustomChallenge(item.id)}
            >
              <Text style={sharedStyles.dangerButtonText}>Delete</Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  };

  return (
    <ScreenContainer>
      <View style={sharedStyles.topBar}>
        <View style={styles.titleWrap}>
          <Text style={sharedStyles.title}>Custom Mode</Text>
          <Pressable onPress={() => router.push("/settings")}>
            <Text style={styles.globalDisclaimerLink}>
              Some challenges are disabled in Settings.
            </Text>
            <Text style={styles.globalDisclaimerLink}>
              Tap here to manage them.
            </Text>
          </Pressable>
        </View>

        <Pressable
          style={sharedStyles.smallActionButton}
          onPress={() => router.push("/custom2")}
        >
          <Text style={sharedStyles.smallActionButtonText}>Next</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={sharedStyles.sectionTitle}>Categories</Text>
          </View>

          <View style={styles.categoryWrap}>
            {ALL_CATEGORIES.map((category) => {
              const active = customModeEnabledCategories.includes(category);

              return (
                <Pressable
                  key={category}
                  style={[sharedStyles.chip, active && sharedStyles.chipActive]}
                  onPress={() => toggleCategory(category)}
                >
                  <Text style={sharedStyles.chipText}>{category}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={sharedStyles.sectionTitle}>Challenges</Text>

            <Pressable
              style={sharedStyles.smallActionButton}
              onPress={() => setCreateModalVisible(true)}
            >
              <Text style={sharedStyles.smallActionButtonText}>
                Add Challenge
              </Text>
            </Pressable>
          </View>

          <View style={styles.groupToggleWrap}>
            {Object.keys(enabledGroups).map((groupName) => {
              const active = enabledGroups[groupName];

              return (
                <Pressable
                  key={groupName}
                  style={[sharedStyles.chip, active && sharedStyles.chipActive]}
                  onPress={() => toggleGroupEnabled(groupName)}
                >
                  <Text style={sharedStyles.chipText}>{groupName}</Text>
                </Pressable>
              );
            })}
          </View>

          {visibleChallenges.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={sharedStyles.emptyStateTitle}>
                No visible challenges
              </Text>
              <Text style={sharedStyles.emptyStateText}>
                Enable more categories or create a custom challenge.
              </Text>
            </View>
          ) : (
            <View style={styles.challengeGroups}>
              {Object.entries(groupedChallenges)
                .filter(([groupName]) => enabledGroups[groupName] ?? true)
                .map(([groupName, items]) => {
                  const isCollapsed = collapsedGroups[groupName] ?? false;

                  return (
                    <View key={groupName} style={styles.challengeGroupSection}>
                      <Pressable
                        style={styles.challengeGroupHeader}
                        onPress={() => toggleGroupCollapsed(groupName)}
                      >
                        <Text style={styles.challengeGroupTitle}>
                          {groupName} ({items.length})
                        </Text>
                        <Text style={styles.challengeGroupArrow}>
                          {isCollapsed ? "▸" : "▾"}
                        </Text>
                      </Pressable>

                      {!isCollapsed && (
                        <View style={styles.challengeGroupList}>
                          {items.map((item) => (
                            <View key={item.id}>
                              {renderChallengeItem({ item })}
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  );
                })}
            </View>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={createModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <View style={sharedStyles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={sharedStyles.modalHeader}>
              <Text style={sharedStyles.modalTitle}>
                Create Custom Challenge
              </Text>
              <Pressable onPress={() => setCreateModalVisible(false)}>
                <Text style={sharedStyles.modalCloseText}>Close</Text>
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={sharedStyles.inputLabel}>Title</Text>
              <TextInput
                value={newTitle}
                onChangeText={setNewTitle}
                placeholder="Challenge name"
                placeholderTextColor="#8b8b8b"
                style={sharedStyles.input}
              />

              <Text style={sharedStyles.inputLabel}>Description</Text>
              <TextInput
                value={newDescription}
                onChangeText={setNewDescription}
                placeholder="What should the player do?"
                placeholderTextColor="#8b8b8b"
                style={[
                  sharedStyles.input,
                  sharedStyles.textArea,
                  styles.textArea,
                ]}
                multiline
              />

              <Text style={sharedStyles.inputLabel}>Difficulty</Text>
              <View style={styles.difficultyRow}>
                {(["easy", "normal", "hard", "brutal"] as Difficulty[]).map(
                  (level) => {
                    const selected = newDifficulty === level;

                    return (
                      <Pressable
                        key={level}
                        style={[
                          sharedStyles.chip,
                          styles.difficultyButton,
                          selected && sharedStyles.chipActive,
                        ]}
                        onPress={() => setNewDifficulty(level)}
                      >
                        <Text style={sharedStyles.chipText}>{level}</Text>
                      </Pressable>
                    );
                  },
                )}
              </View>

              <Text style={sharedStyles.inputLabel}>Categories</Text>
              <View style={styles.categoryWrap}>
                {ALL_CATEGORIES.map((category) => {
                  const selected = newCategories.includes(category);

                  return (
                    <Pressable
                      key={category}
                      style={[
                        sharedStyles.chip,
                        selected && sharedStyles.chipActive,
                      ]}
                      onPress={() => toggleNewCategory(category)}
                    >
                      <Text style={sharedStyles.chipText}>{category}</Text>
                    </Pressable>
                  );
                })}
              </View>

              <Pressable
                style={[sharedStyles.primaryButton, styles.createButton]}
                onPress={handleCreateChallenge}
              >
                <Text style={sharedStyles.primaryButtonText}>
                  Create Challenge
                </Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 20,
  },

  titleWrap: {
    flex: 1,
    paddingRight: 12,
  },

  section: {
    marginBottom: 22,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    gap: 12,
  },

  categoryWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  challengeCard: {
    backgroundColor: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.purple,
    borderRadius: 16,
    padding: 14,
    marginBottom: 4,
  },

  challengeCardGloballyDisabled: {
    opacity: 0.55,
  },

  challengeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 10,
  },

  challengeHeaderText: {
    flex: 1,
  },

  challengeTitle: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 4,
  },

  challengeMeta: {
    color: "#aaaaaa",
    fontSize: 12,
  },

  challengeDescription: {
    color: "#d0d0d0",
    fontSize: 14,
    lineHeight: 20,
  },

  challengeFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 12,
  },

  emptyState: {
    backgroundColor: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.purple,
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 18,
    alignItems: "center",
  },

  modalCard: {
    maxHeight: "85%",
    backgroundColor: COLORS.black,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.purple,
    padding: 16,
  },

  textArea: {
    minHeight: 100,
  },

  difficultyRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  difficultyButton: {
    borderRadius: 12,
  },

  createButton: {
    marginTop: 18,
  },

  globalDisclaimerLink: {
    color: "#a78bfa",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
    maxWidth: 280,
    textDecorationLine: "underline",
  },

  challengeGroups: {
    gap: 6,
  },

  challengeGroupSection: {
    marginBottom: 2,
  },

  challengeGroupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.purple,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  challengeGroupTitle: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },

  challengeGroupArrow: {
    color: "#9ca3af",
    fontSize: 16,
    fontWeight: "800",
  },

  challengeGroupList: {
    marginTop: 8,
    gap: 8,
  },

  groupToggleWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
});
