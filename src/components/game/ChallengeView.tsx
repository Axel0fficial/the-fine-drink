import React from "react";
import { Text, View } from "react-native";
import {
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";

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
  const panGesture = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .failOffsetY([-15, 15])
    .onEnd((event) => {
      if (!canToggle) return;

      if (event.translationX < -50 && selectedChallengeSlot === "primary") {
        onSelectSecondary();
      } else if (
        event.translationX > 50 &&
        selectedChallengeSlot === "secondary"
      ) {
        onSelectPrimary();
      }
    });

  const indicatorText = !canToggle
    ? "1 / 1"
    : selectedChallengeSlot === "primary"
      ? "1 / 2"
      : "2 / 2";

  return (
    <>
      <View style={styles.challengeHintRow}>
        <Text
          style={[
            styles.challengeArrow,
            selectedChallengeSlot === "primary" && styles.challengeArrowDisabled,
          ]}
        >
          ←
        </Text>

        <Text style={styles.challengeIndicator}>{indicatorText}</Text>

        <Text
          style={[
            styles.challengeArrow,
            (!canToggle || selectedChallengeSlot === "secondary") &&
              styles.challengeArrowDisabled,
          ]}
        >
          →
        </Text>
      </View>

      <GestureDetector gesture={panGesture}>
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

          {canToggle && (
            <Text style={styles.challengeSwipeHint}>Slide left or right</Text>
          )}
        </View>
      </GestureDetector>
    </>
  );
}