import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Challenge, GamePlayer } from "../../types/game";
import type { MatchStatus, MiniGameResult } from "../types";
import {
    FINE_DRINK_BAD_PROMPTS,
    FINE_DRINK_GOOD_PROMPTS,
    type FineDrinkPrompt,
} from "./fineDrinkPrompts";

type Props = {
  challenge: Challenge;
  currentPlayer: GamePlayer;
  onComplete: (result: MiniGameResult) => void;
};

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export default function FineDrinkMiniGame({
  challenge,
  currentPlayer,
  onComplete,
}: Props) {
  const [phase, setPhase] = useState<"offer" | "revealed">("offer");
  const [revealedPrompt, setRevealedPrompt] = useState<FineDrinkPrompt | null>(
    null,
  );

  const visibleTone = useMemo<"good" | "bad">(
    () => (Math.random() < 0.5 ? "good" : "bad"),
    [],
  );

  const visiblePrompt = useMemo(() => {
    return visibleTone === "good"
      ? randomItem(FINE_DRINK_GOOD_PROMPTS)
      : randomItem(FINE_DRINK_BAD_PROMPTS);
  }, [visibleTone]);

  const hiddenPool = useMemo(() => {
    return visibleTone === "good"
      ? FINE_DRINK_BAD_PROMPTS
      : FINE_DRINK_GOOD_PROMPTS;
  }, [visibleTone]);

  const handlePass = () => {
    onComplete({
      outcome: "passed",
      pointsAwarded: 0,
      statusText: `${currentPlayer.name} refused The Fine Drink after seeing a ${visibleTone} omen.`,
    });
  };

  const handleTakeDeal = () => {
    const hiddenPrompt = randomItem(hiddenPool);
    setRevealedPrompt(hiddenPrompt);
    setPhase("revealed");
  };

  const handleAcceptRevealedStatus = () => {
    if (!revealedPrompt) return;

    const appliedStatus: MatchStatus = {
      id: `match_status_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      playerId: currentPlayer.id,
      playerName: currentPlayer.name,
      text: revealedPrompt.text,
      tone: revealedPrompt.tone,
      sourceChallengeId: challenge.id,
    };

    onComplete({
      outcome: "completed",
      pointsAwarded: challenge.points,
      statusText: `${currentPlayer.name} accepted The Fine Drink and gained a ${
        revealedPrompt.tone
      } permanent fate.`,
      appliedStatus,
      payload: {
        visiblePromptId: visiblePrompt.id,
        revealedPromptId: revealedPrompt.id,
      },
    });
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{challenge.title}</Text>
      <Text style={styles.subtitle}>{challenge.description}</Text>

      {phase === "offer" && (
        <>
          <View
            style={[
              styles.promptCard,
              visibleTone === "good" ? styles.goodCard : styles.badCard,
            ]}
          >
            <Text style={styles.promptLabel}>
              Visible {visibleTone === "good" ? "Blessing" : "Curse"}
            </Text>
            <Text style={styles.promptText}>{visiblePrompt.text}</Text>
          </View>

          <Text style={styles.helperText}>
            Pass now, or take the deal and receive a hidden prompt from the
            opposite side for the rest of the match.
          </Text>

          <View style={styles.buttonRow}>
            <Pressable style={styles.secondaryButton} onPress={handlePass}>
              <Text style={styles.secondaryButtonText}>Pass</Text>
            </Pressable>

            <Pressable style={styles.primaryButton} onPress={handleTakeDeal}>
              <Text style={styles.primaryButtonText}>Take the Deal</Text>
            </Pressable>
          </View>
        </>
      )}

      {phase === "revealed" && revealedPrompt && (
        <>
          <View
            style={[
              styles.promptCard,
              revealedPrompt.tone === "good" ? styles.goodCard : styles.badCard,
            ]}
          >
            <Text style={styles.promptLabel}>
              Revealed {revealedPrompt.tone === "good" ? "Blessing" : "Curse"}
            </Text>
            <Text style={styles.promptText}>{revealedPrompt.text}</Text>
          </View>

          <Text style={styles.helperText}>
            This status is now permanent for the rest of the match.
          </Text>

          <Pressable
            style={styles.primaryButton}
            onPress={handleAcceptRevealedStatus}
          >
            <Text style={styles.primaryButtonText}>Continue</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#171717",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
  },
  title: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 8,
  },
  subtitle: {
    color: "#8b8b8b",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 18,
  },
  promptCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
  },
  goodCard: {
    backgroundColor: "#15261b",
    borderColor: "#2f855a",
  },
  badCard: {
    backgroundColor: "#2a1717",
    borderColor: "#c53030",
  },
  promptLabel: {
    color: "#e5e7eb",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  promptText: {
    color: "#ffffff",
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "700",
  },
  helperText: {
    color: "#d1d5db",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#8b5cf6",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 15,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#2b2b2b",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 15,
  },
});
