import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
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
import type {
  ModifierScope,
  ModifierType,
  SessionModifier,
} from "../src/types/game";

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

const DURATION_OPTIONS: CustomModifierDuration[] = ["turn", "round", "session"];

export default function Custom3Screen() {
  const { modifiers, setModifiers, selectedPlayers } = useGameStore();

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newScope, setNewScope] = useState<ModifierScope>("session");
  const [prankTargetPlayerId, setPrankTargetPlayerId] = useState<string | null>(
    null,
  );
  const [prankIntensity, setPrankIntensity] = useState<1 | 2 | 3>(2);
  const [newDuration, setNewDuration] =
    useState<CustomModifierDuration>("session");

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
          : modifier,
      ),
    );
  };

  const deleteCustomModifier = (modifierId: string) => {
    setModifiers((prev) =>
      prev.filter(
        (modifier) => !(modifier.id === modifierId && modifier.isCustom),
      ),
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
      Alert.alert(
        "Missing description",
        "Please add a description for the modifier.",
      );
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

  const prankModifier = useMemo(() => {
    return (
      modifiers.find((m) => m.logicConfig?.effect === "prank_mode") ?? null
    );
  }, [modifiers]);

  const upsertPrankModifier = () => {
    if (!prankTargetPlayerId) {
      Alert.alert("Pick a player", "Select who you want to prank.");
      return;
    }

    setModifiers((prev) => {
      const existingIndex = prev.findIndex(
        (m) => m.logicConfig?.effect === "prank_mode",
      );

      const prankConfig = {
        effect: "prank_mode",
        targetPlayerId: prankTargetPlayerId,
        intensity: prankIntensity,
      };

      if (existingIndex >= 0) {
        return prev.map((m, i) =>
          i === existingIndex
            ? { ...m, enabled: true, logicConfig: prankConfig }
            : m,
        );
      }

      const newModifier: SessionModifier = {
        id: `mod_prank_${Date.now()}`,
        title: "Prank Mode",
        description: "One player gets harder challenges.",
        type: "leader_penalty",
        scope: "player",
        enabled: true,
        isCustom: true,
        duration: "session",
        logicConfig: prankConfig,
      };

      return [newModifier, ...prev];
    });
  };

  const removePrankModifier = () => {
    setModifiers((prev) =>
      prev.filter((m) => m.logicConfig?.effect !== "prank_mode"),
    );
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
            trackColor={{ false: "#2a2a2a", true: COLORS.purpleDark }}
            thumbColor="#ffffff"
          />
        </View>

        <Text style={styles.modifierDescription}>{item.description}</Text>

        <View style={styles.modifierFooter}>
          <Text style={styles.modifierStatus}>
            {item.enabled ? "Enabled" : "Disabled"}
          </Text>

          {item.isCustom && (
            <Pressable
              style={sharedStyles.dangerButton}
              onPress={() => deleteCustomModifier(item.id)}
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
          <Text style={sharedStyles.subtitle}>
            Add handicaps, catch-up effects, and session rules.
          </Text>
        </View>

        <Pressable
          style={sharedStyles.smallActionButton}
          onPress={() => router.push("/game")}
        >
          <Text style={sharedStyles.smallActionButtonText}>Start</Text>
        </Pressable>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={sharedStyles.sectionTitle}>Modifiers</Text>

        <Pressable
          style={sharedStyles.smallActionButton}
          onPress={() => setCreateModalVisible(true)}
        >
          <Text style={sharedStyles.smallActionButtonText}>Add Modifier</Text>
        </Pressable>
      </View>

      <View style={styles.prankCard}>
        <Text style={styles.prankTitle}>Prank Mode</Text>

        <Text style={styles.prankDescription}>
          Select a player to receive harder challenges more often.
        </Text>

        <Text style={styles.prankLabel}>Target</Text>
        <View style={styles.prankPlayerWrap}>
          {selectedPlayers.map((player) => {
            const selected = prankTargetPlayerId === player.id;

            return (
              <Pressable
                key={player.id}
                style={[
                  sharedStyles.chip,
                  styles.prankPlayerChip,
                  selected && sharedStyles.chipActive,
                ]}
                onPress={() => setPrankTargetPlayerId(player.id)}
              >
                <Text style={sharedStyles.chipText}>{player.name}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.prankLabel}>Intensity</Text>
        <View style={styles.prankIntensityWrap}>
          {[1, 2, 3].map((level) => {
            const selected = prankIntensity === level;

            return (
              <Pressable
                key={level}
                style={[
                  sharedStyles.chip,
                  styles.prankIntensityChip,
                  selected && sharedStyles.chipActive,
                ]}
                onPress={() => setPrankIntensity(level as 1 | 2 | 3)}
              >
                <Text style={sharedStyles.chipText}>
                  {level === 1 ? "Mild" : level === 2 ? "Mean" : "Evil"}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.prankButtonsRow}>
          <Pressable
            style={[sharedStyles.primaryButton, styles.prankApplyButton]}
            onPress={upsertPrankModifier}
          >
            <Text style={sharedStyles.primaryButtonText}>
              {prankModifier ? "Update" : "Enable"}
            </Text>
          </Pressable>

          {!!prankModifier && (
            <Pressable
              style={[sharedStyles.secondaryButton, styles.prankRemoveButton]}
              onPress={removePrankModifier}
            >
              <Text style={sharedStyles.secondaryButtonText}>Remove</Text>
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.listWrapper}>
        {sortedModifiers.length === 0 ? (
          <View style={sharedStyles.emptyState}>
            <Text style={sharedStyles.emptyStateTitle}>No modifiers yet</Text>
            <Text style={sharedStyles.emptyStateText}>
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

      <View style={sharedStyles.bottomActions}>
        <Pressable
          style={[sharedStyles.secondaryButton, styles.bottomButton]}
          onPress={() => router.push("/custom2")}
        >
          <Text style={sharedStyles.secondaryButtonText}>Back</Text>
        </Pressable>

        <Pressable
          style={[sharedStyles.primaryButton, styles.bottomButton]}
          onPress={() => router.push("/game")}
        >
          <Text style={sharedStyles.primaryButtonText}>Start Game</Text>
        </Pressable>
      </View>

      <Modal
        visible={createModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <View style={sharedStyles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={sharedStyles.modalHeader}>
              <Text style={sharedStyles.modalTitle}>Create Modifier</Text>
              <Pressable onPress={() => setCreateModalVisible(false)}>
                <Text style={sharedStyles.modalCloseText}>Close</Text>
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={sharedStyles.inputLabel}>Title</Text>
              <TextInput
                value={newTitle}
                onChangeText={setNewTitle}
                placeholder="Modifier name"
                placeholderTextColor="#8b8b8b"
                style={sharedStyles.input}
              />

              <Text style={sharedStyles.inputLabel}>Description</Text>
              <TextInput
                value={newDescription}
                onChangeText={setNewDescription}
                placeholder="Describe the rule or effect"
                placeholderTextColor="#8b8b8b"
                style={[
                  sharedStyles.input,
                  sharedStyles.textArea,
                  styles.textArea,
                ]}
                multiline
              />

              <Text style={sharedStyles.inputLabel}>Scope</Text>
              <View style={styles.optionWrap}>
                {SCOPE_OPTIONS.map((scope) => {
                  const selected = newScope === scope;

                  return (
                    <Pressable
                      key={scope}
                      style={[
                        sharedStyles.chip,
                        selected && sharedStyles.chipActive,
                      ]}
                      onPress={() => setNewScope(scope)}
                    >
                      <Text style={sharedStyles.chipText}>
                        {scope === "last_place" ? "last place" : scope}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={sharedStyles.inputLabel}>Duration</Text>
              <View style={styles.optionWrap}>
                {DURATION_OPTIONS.map((duration) => {
                  const selected = newDuration === duration;

                  return (
                    <Pressable
                      key={duration}
                      style={[
                        sharedStyles.chip,
                        selected && sharedStyles.chipActive,
                      ]}
                      onPress={() => setNewDuration(duration)}
                    >
                      <Text style={sharedStyles.chipText}>{duration}</Text>
                    </Pressable>
                  );
                })}
              </View>

              <Pressable
                style={[sharedStyles.primaryButton, styles.createButton]}
                onPress={handleCreateModifier}
              >
                <Text style={sharedStyles.primaryButtonText}>
                  Create Modifier
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
  titleWrap: {
    flex: 1,
    paddingRight: 12,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    gap: 12,
  },

  infoBox: {
    backgroundColor: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.purple,
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

  prankCard: {
    backgroundColor: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.purple,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },

  prankTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },

  prankDescription: {
    color: "#aaaaaa",
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },

  prankLabel: {
    color: "#ffffff",
    fontWeight: "700",
    marginBottom: 6,
  },

  prankPlayerWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },

  prankPlayerChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  prankIntensityWrap: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },

  prankIntensityChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },

  prankButtonsRow: {
    flexDirection: "row",
    gap: 10,
  },

  prankApplyButton: {
    flex: 1,
  },

  prankRemoveButton: {
    minWidth: 110,
  },

  listWrapper: {
    flex: 1,
    backgroundColor: COLORS.black,
    borderRadius: 16,
    borderWidth: 0,
    padding: 10,
  },

  listContent: {
    paddingBottom: 8,
  },

  modifierCard: {
    backgroundColor: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.purple,
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
    gap: 12,
  },

  modifierStatus: {
    color: "#8b8b8b",
    fontSize: 13,
    fontWeight: "700",
  },

  bottomButton: {
    flex: 1,
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

  optionWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  createButton: {
    marginTop: 18,
  },
});
