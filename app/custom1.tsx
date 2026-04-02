import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

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

export default function Custom1Screen() {
  const { challenges, enabledCategories, setChallenges, setEnabledCategories } =
    useGameStore();

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDifficulty, setNewDifficulty] = useState<Difficulty>("normal");
  const [newCategories, setNewCategories] = useState<string[]>([]);

  const visibleChallenges = useMemo(() => {
    return challenges.filter((challenge) =>
      challenge.categories.some((category) =>
        enabledCategories.includes(category),
      ),
    );
  }, [challenges, enabledCategories]);

  const toggleChallengeEnabled = (challengeId: string) => {
    setChallenges((prev) =>
      prev.map((challenge) =>
        challenge.id === challengeId
          ? { ...challenge, enabled: !challenge.enabled }
          : challenge,
      ),
    );
  };

  const toggleCategory = (category: string) => {
    setEnabledCategories((prev) =>
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
    return (
      <View style={styles.challengeCard}>
        <View style={styles.challengeHeader}>
          <View style={styles.challengeHeaderText}>
            <Text style={styles.challengeTitle}>{item.title}</Text>
            <Text style={styles.challengeMeta}>
              {item.difficulty.toUpperCase()} • {item.categories.join(", ")}
            </Text>
          </View>

          <Switch
            value={item.enabled}
            onValueChange={() => toggleChallengeEnabled(item.id)}
          />
        </View>

        <Text style={styles.challengeDescription}>{item.description}</Text>

        <View style={styles.challengeFooter}>
          <Text style={styles.challengeStatus}>
            {item.enabled ? "Enabled" : "Disabled"}
          </Text>

          {item.isCustom && (
            <Pressable
              style={styles.deleteButton}
              onPress={() => deleteCustomChallenge(item.id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <View>
            <Text style={styles.title}>Custom Mode</Text>
            <Text style={styles.subtitle}>
              Choose categories, enable challenges, and create your own.
            </Text>
          </View>

          <Pressable
            style={styles.nextButton}
            onPress={() => router.push("/custom2")}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Categories</Text>
            </View>

            <View style={styles.categoryWrap}>
              {ALL_CATEGORIES.map((category) => {
                const active = enabledCategories.includes(category);

                return (
                  <Pressable
                    key={category}
                    style={[
                      styles.categoryChip,
                      active && styles.categoryChipActive,
                    ]}
                    onPress={() => toggleCategory(category)}
                  >
                    <Text style={styles.categoryChipText}>{category}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Challenges</Text>

              <Pressable
                style={styles.addCustomButton}
                onPress={() => setCreateModalVisible(true)}
              >
                <Text style={styles.addCustomButtonText}>Add Challenge</Text>
              </Pressable>
            </View>

            {visibleChallenges.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateTitle}>
                  No visible challenges
                </Text>
                <Text style={styles.emptyStateText}>
                  Enable more categories or create a custom challenge.
                </Text>
              </View>
            ) : (
              <FlatList
                data={visibleChallenges}
                keyExtractor={(item) => item.id}
                renderItem={renderChallengeItem}
                scrollEnabled={false}
                contentContainerStyle={styles.challengeList}
              />
            )}
          </View>
        </ScrollView>
      </View>

      <Modal
        visible={createModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Custom Challenge</Text>
              <Pressable onPress={() => setCreateModalVisible(false)}>
                <Text style={styles.modalCloseText}>Close</Text>
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Title</Text>
              <TextInput
                value={newTitle}
                onChangeText={setNewTitle}
                placeholder="Challenge name"
                placeholderTextColor="#8b8b8b"
                style={styles.input}
              />

              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                value={newDescription}
                onChangeText={setNewDescription}
                placeholder="What should the player do?"
                placeholderTextColor="#8b8b8b"
                style={[styles.input, styles.textArea]}
                multiline
              />

              <Text style={styles.inputLabel}>Difficulty</Text>
              <View style={styles.difficultyRow}>
                {(["easy", "normal", "hard", "brutal"] as Difficulty[]).map(
                  (level) => {
                    const selected = newDifficulty === level;

                    return (
                      <Pressable
                        key={level}
                        style={[
                          styles.difficultyButton,
                          selected && styles.difficultyButtonActive,
                        ]}
                        onPress={() => setNewDifficulty(level)}
                      >
                        <Text style={styles.difficultyButtonText}>{level}</Text>
                      </Pressable>
                    );
                  },
                )}
              </View>

              <Text style={styles.inputLabel}>Categories</Text>
              <View style={styles.categoryWrap}>
                {ALL_CATEGORIES.map((category) => {
                  const selected = newCategories.includes(category);

                  return (
                    <Pressable
                      key={category}
                      style={[
                        styles.categoryChip,
                        selected && styles.categoryChipActive,
                      ]}
                      onPress={() => toggleNewCategory(category)}
                    >
                      <Text style={styles.categoryChipText}>{category}</Text>
                    </Pressable>
                  );
                })}
              </View>

              <Pressable
                style={styles.createButton}
                onPress={handleCreateChallenge}
              >
                <Text style={styles.createButtonText}>Create Challenge</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#111111",
  },
  container: {
    flex: 1,
    backgroundColor: "#111111",
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 22,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#ffffff",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: "#b5b5b5",
    maxWidth: 260,
  },
  nextButton: {
    backgroundColor: "#8b5cf6",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  nextButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
  },
  section: {
    marginBottom: 22,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#ffffff",
  },
  addCustomButton: {
    backgroundColor: "#1f1f1f",
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  addCustomButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  categoryWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryChip: {
    backgroundColor: "#1d1d1d",
    borderWidth: 1,
    borderColor: "#313131",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  categoryChipActive: {
    backgroundColor: "#2b2144",
    borderColor: "#8b5cf6",
  },
  categoryChipText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  challengeList: {
    gap: 12,
  },
  challengeCard: {
    backgroundColor: "#1b1b1b",
    borderWidth: 1,
    borderColor: "#2e2e2e",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
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
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  challengeStatus: {
    color: "#8b8b8b",
    fontSize: 13,
    fontWeight: "700",
  },
  deleteButton: {
    backgroundColor: "#3a1c1c",
    borderWidth: 1,
    borderColor: "#6b2b2b",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  deleteButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },
  emptyState: {
    backgroundColor: "#171717",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 18,
    alignItems: "center",
  },
  emptyStateTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
  },
  emptyStateText: {
    color: "#aaaaaa",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.72)",
    justifyContent: "center",
    padding: 18,
  },
  modalCard: {
    maxHeight: "85%",
    backgroundColor: "#151515",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#303030",
    padding: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  modalTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
  },
  modalCloseText: {
    color: "#8b5cf6",
    fontSize: 15,
    fontWeight: "700",
  },
  inputLabel: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#1b1b1b",
    borderWidth: 1,
    borderColor: "#313131",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: "#ffffff",
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  difficultyRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  difficultyButton: {
    backgroundColor: "#1d1d1d",
    borderWidth: 1,
    borderColor: "#313131",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  difficultyButtonActive: {
    backgroundColor: "#2b2144",
    borderColor: "#8b5cf6",
  },
  difficultyButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  createButton: {
    marginTop: 18,
    backgroundColor: "#8b5cf6",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  createButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },
});
