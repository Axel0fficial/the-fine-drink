import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Challenge, PlayerTag } from "../../types/game";

type Props = {
  selectedChallengeSlot: "primary" | "secondary";
  onSelectPrimary: () => void;
  onSelectSecondary: () => void;
  canToggle: boolean;
  shownChallenge: Challenge | null;
  shownDescription: string;
  currentPlayerTag: PlayerTag;
};

export default function ChallengeView({
  selectedChallengeSlot,
  onSelectPrimary,
  onSelectSecondary,
  canToggle,
  shownChallenge,
  shownDescription,
  currentPlayerTag,
}: Props) {
  return (
    <>
      <View style={styles.challengeSwitchRow}>
        <Pressable
          style={[
            styles.challengeToggle,
            selectedChallengeSlot === "primary" && styles.challengeToggleActive,
          ]}
          onPress={onSelectPrimary}
        >
          <Text style={styles.challengeToggleText}>Challenge A</Text>
        </Pressable>

        <Pressable
          style={[
            styles.challengeToggle,
            selectedChallengeSlot === "secondary" &&
              styles.challengeToggleActive,
            !canToggle && styles.challengeToggleDisabled,
          ]}
          onPress={() => {
            if (canToggle) onSelectSecondary();
          }}
        >
          <Text style={styles.challengeToggleText}>Challenge B</Text>
        </Pressable>
      </View>

      <View style={styles.challengeCard}>
        <Text style={styles.challengeTitle}>
          {shownChallenge ? shownChallenge.title : "No challenge available"}
        </Text>

        <Text style={styles.challengeMeta}>
          {shownChallenge
            ? `${shownChallenge.difficulty.toUpperCase()} • ${shownChallenge.categories.join(", ")}`
            : currentPlayerTag === "non_drinker"
              ? "This player cannot receive drinking challenges."
              : "No eligible challenge found."}
        </Text>

        <Text style={styles.challengeDescription}>{shownDescription}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  challengeSwitchRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  challengeToggle: {
    flex: 1,
    backgroundColor: "#222222",
    borderWidth: 1,
    borderColor: "#313131",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  challengeToggleActive: {
    backgroundColor: "#2b2144",
    borderColor: "#8b5cf6",
  },
  challengeToggleDisabled: {
    opacity: 0.45,
  },
  challengeToggleText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
  },
  challengeCard: {
    flex: 1,
    backgroundColor: "#171717",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
  },
  challengeTitle: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 8,
  },
  challengeMeta: {
    color: "#8b8b8b",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  challengeDescription: {
    color: "#f3f3f3",
    fontSize: 18,
    lineHeight: 28,
  },
});