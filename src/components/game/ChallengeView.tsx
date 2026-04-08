import React, { useMemo, useRef } from "react";
import { PanResponder, Text, View } from "react-native";
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
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const horizontalMove = Math.abs(gestureState.dx);
        const verticalMove = Math.abs(gestureState.dy);
        return horizontalMove > 20 && horizontalMove > verticalMove;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (!canToggle) return;

        if (gestureState.dx < -40 && selectedChallengeSlot === "primary") {
          onSelectSecondary();
        } else if (
          gestureState.dx > 40 &&
          selectedChallengeSlot === "secondary"
        ) {
          onSelectPrimary();
        }
      },
    }),
  ).current;

  const indicatorText = useMemo(() => {
    if (!canToggle) return "1 / 1";
    return selectedChallengeSlot === "primary" ? "1 / 2" : "2 / 2";
  }, [canToggle, selectedChallengeSlot]);

  return (
    <>
      <View style={styles.challengeHintRow}>
        <Text
          style={[
            styles.challengeArrow,
            selectedChallengeSlot === "primary" &&
              styles.challengeArrowDisabled,
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

      <View {...panResponder.panHandlers} style={styles.challengeCard}>
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
    </>
  );
}
