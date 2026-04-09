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
  const indicatorText = !canToggle
    ? "1 / 1"
    : selectedChallengeSlot === "primary"
      ? "1 / 2"
      : "2 / 2";

  const goLeft = () => {
    if (!canToggle) return;
    if (selectedChallengeSlot === "secondary") {
      onSelectPrimary();
    }
  };

  const goRight = () => {
    if (!canToggle) return;
    if (selectedChallengeSlot === "primary") {
      onSelectSecondary();
    }
  };

  return (
    <>
      <View style={styles.challengeNavRow}>
        <Pressable
          style={[
            styles.challengeNavButton,
            selectedChallengeSlot === "primary" &&
              styles.challengeNavButtonDisabled,
          ]}
          onPress={goLeft}
          disabled={!canToggle || selectedChallengeSlot === "primary"}
        >
          <Text style={styles.challengeNavButtonText}>←</Text>
        </Pressable>

        <Text style={styles.challengeIndicator}>{indicatorText}</Text>

        <Pressable
          style={[
            styles.challengeNavButton,
            (!canToggle || selectedChallengeSlot === "secondary") &&
              styles.challengeNavButtonDisabled,
          ]}
          onPress={goRight}
          disabled={!canToggle || selectedChallengeSlot === "secondary"}
        >
          <Text style={styles.challengeNavButtonText}>→</Text>
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
