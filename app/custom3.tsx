import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  FlatList,
  Modal,
  TextInput,
  Switch,
  Alert,
  ScrollView,
} from "react-native";
import { router } from "expo-router";

import { useGameStore } from "../src/state/gameStore";
import type { ModifierScope, ModifierType, SessionModifier } from "../src/types/game";

type CustomModifierDuration = "turn" | "round" | "session";

function createCustomModifier(input: {
  title: string;
  description: string;
  scope: ModifierScope;
  duration: CustomModifierDuration;
}): SessionModifier {
  return {
    id: `custom_modifier_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    title: input.title,
    description: input.description,
    type: "permanent_session_rule",
    scope: input.scope,
    enabled: true,
    isCustom: true,
    duration: input.duration,
  };
}

const SCOPE_OPTIONS: ModifierScope[] = [
  "session",
  "leader",
  "last_place",
  "player",
];

const DURATION_OPTIONS: CustomModifierDuration[] = [
  "turn",
  "round",
  "session",
];

export default function Custom3Screen() {
  const { modifiers, setModifiers } = useGameStore();

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newScope, setNewScope] = useState<ModifierScope>("session");
  const [newDuration, setNewDuration] = useState<CustomModifierDuration>("session");

  const sortedModifiers = useMemo(() => {
    const builtIn = modifiers.filter((modifier) => !modifier.isCustom);
    const custom = modifiers.filter((modifier) => modifier.isCustom);
    return [...builtIn, ...custom];
  }, [modifiers]);

  const toggleModifierEnabled = (modifierId: string) => {
    setModifiers((prev) =>
      prev.map((modifier) =>
        modifier.id === modifierId
          ? { ...modifier, enabled: !modifier.enabled }
          : modifier
      )
    );
  };

  const deleteCustomModifier = (modifierId: string) => {
    setModifiers((prev) =>
      prev.filter(
        (modifier) => !(modifier.id === modifierId && modifier.isCustom)
      )
    );
  };

  const handleCreateModifier = () => {
    const cleanTitle = newTitle.trim();
    const cleanDescription = newDescription.trim();

    if (!cleanTitle) {
      Alert.alert("Missing title", "Please add a title for the modifier.");
      return;
    }

    if (!cleanDescription) {
      Alert.alert("Missing description", "Please add a description for the modifier.");
      return;
    }

    const newModifier = createCustomModifier({
      title: cleanTitle,
      description: cleanDescription,
      scope: newScope,
      duration: newDuration,
    });

    setModifiers((prev) => [newModifier, ...prev]);

    setNewTitle("");
    setNewDescription("");
    setNewScope("session");
    setNewDuration("session");
    setCreateModalVisible(false);
  };

  const getTypeLabel = (type: ModifierType) => {
    switch (type) {
      case "catch_up_bonus":
        return "Catch-up";
      case "leader_penalty":
        return "Leader penalty";
      case "temporary_status":
        return "Temporary";
      case "permanent_session_rule":
        return "Session rule";
      case "difficulty_shift":
        return "Difficulty";
      default:
        return type;
    }
  };

  const formatScope = (scope: ModifierScope) => {
    switch (scope) {
      case "last_place":
        return "last place";
      default:
        return scope;
    }
  };

  const renderModifierItem = ({ item }: { item: SessionModifier }) => {
    return (
      <View style={styles.modifierCard}>
        <View style={styles.modifierHeader}>
          <View style={styles.modifierHeaderText}>
            <Text style={styles.modifierTitle}>{item.title}</Text>
            <Text style={styles.modifierMeta}>
              {getTypeLabel(item.type)} • {formatScope(item.scope)} •{" "}
              {item.duration ?? "session"}
            </Text>
          </View>

          <Switch
            value={item.enabled}
            onValueChange={() => toggleModifierEnabled(item.id)}
          />
        </View>

        <Text style={styles.modifierDescription}>{item.description}</Text>

        <View style={styles.modifierFooter}>
          <Text style={styles.modifierStatus}>
            {item.enabled ? "Enabled" : "Disabled"}
          </Text>

          {item.isCustom && (
            <Pressable
              style={styles.deleteButton}
              onPress={() => deleteCustomModifier(item.id)}
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
              Add handicaps, catch-up effects, and session rules.
            </Text>
          </View>

          <Pressable style={styles.startButton} onPress={() => router.push("/game")}>
            <Text style={styles.startButtonText}>Start</Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Modifiers</Text>

          <Pressable
            style={styles.addModifierButton}
            onPress={() => setCreateModalVisible(true)}
          >
            <Text style={styles.addModifierButtonText}>Add Modifier</Text>
          </Pressable>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoBoxText}>
            Use this page to make the session more chaotic, more balanced, or
            just weirder.
          </Text>
        </View>

        <View style={styles.listWrapper}>
          {sortedModifiers.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No modifiers yet</Text>
              <Text style={styles.emptyStateText}>
                Add a custom modifier or enable preset ones.
              </Text>
            </View>
          ) : (
            <FlatList
              data={sortedModifiers}
              keyExtractor={(item) => item.id}
              renderItem={renderModifierItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        <View style={styles.bottomRow}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.push("/custom2")}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>

          <Pressable
            style={styles.continueButton}
            onPress={() => router.push("/game")}
          >
            <Text style={styles.continueButtonText}>Start Game</Text>
          </Pressable>
        </View>
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
              <Text style={styles.modalTitle}>Create Modifier</Text>
              <Pressable onPress={() => setCreateModalVisible(false)}>
                <Text style={styles.modalCloseText}>Close</Text>
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Title</Text>
              <TextInput
                value={newTitle}
                onChangeText={setNewTitle}
                placeholder="Modifier name"
                placeholderTextColor="#8b8b8b"
                style={styles.input}
              />

              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                value={newDescription}
                onChangeText={setNewDescription}
                placeholder="Describe the rule or effect"
                placeholderTextColor="#8b8b8b"
                style={[styles.input, styles.textArea]}
                multiline
              />

              <Text style={styles.inputLabel}>Scope</Text>
              <View style={styles.optionWrap}>
                {SCOPE_OPTIONS.map((scope) => {
                  const selected = newScope === scope;

                  return (
                    <Pressable
                      key={scope}
                      style={[
                        styles.optionChip,
                        selected && styles.optionChipActive,
                      ]}
                      onPress={() => setNewScope(scope)}
                    >
                      <Text style={styles.optionChipText}>
                        {scope === "last_place" ? "last place" : scope}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={styles.inputLabel}>Duration</Text>
              <View style={styles.optionWrap}>
                {DURATION_OPTIONS.map((duration) => {
                  const selected = newDuration === duration;

                  return (
                    <Pressable
                      key={duration}
                      style={[
                        styles.optionChip,
                        selected && styles.optionChipActive,
                      ]}
                      onPress={() => setNewDuration(duration)}
                    >
                      <Text style={styles.optionChipText}>{duration}</Text>
                    </Pressable>
                  );
                })}
              </View>

              <Pressable style={styles.createButton} onPress={handleCreateModifier}>
                <Text style={styles.createButtonText}>Create Modifier</Text>
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
    maxWidth: 250,
  },
  startButton: {
    backgroundColor: "#8b5cf6",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  startButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
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
  addModifierButton: {
    backgroundColor: "#1f1f1f",
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  addModifierButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  infoBox: {
    backgroundColor: "#181818",
    borderWidth: 1,
    borderColor: "#2d2d2d",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  infoBoxText: {
    color: "#bcbcbc",
    fontSize: 13,
    lineHeight: 19,
  },
  listWrapper: {
    flex: 1,
    backgroundColor: "#171717",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    padding: 10,
  },
  listContent: {
    paddingBottom: 8,
  },
  modifierCard: {
    backgroundColor: "#1b1b1b",
    borderWidth: 1,
    borderColor: "#2e2e2e",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  modifierHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 10,
  },
  modifierHeaderText: {
    flex: 1,
  },
  modifierTitle: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 4,
  },
  modifierMeta: {
    color: "#aaaaaa",
    fontSize: 12,
  },
  modifierDescription: {
    color: "#d0d0d0",
    fontSize: 14,
    lineHeight: 20,
  },
  modifierFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  modifierStatus: {
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
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
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
    textAlign: "center",
    lineHeight: 20,
  },
  bottomRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  backButton: {
    flex: 1,
    backgroundColor: "#2b2b2b",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 15,
  },
  continueButton: {
    flex: 1,
    backgroundColor: "#8b5cf6",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  continueButtonText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 15,
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
  optionWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  optionChip: {
    backgroundColor: "#1d1d1d",
    borderWidth: 1,
    borderColor: "#313131",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  optionChipActive: {
    backgroundColor: "#2b2144",
    borderColor: "#8b5cf6",
  },
  optionChipText: {
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