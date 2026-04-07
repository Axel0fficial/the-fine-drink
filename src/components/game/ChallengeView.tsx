import React from "react";
import { Pressable, Text, View } from "react-native";
import type { Challenge, PlayerTag } from "../../types/game";
import { gameSharedStyles as styles } from "../style/gameSharedStyles";

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