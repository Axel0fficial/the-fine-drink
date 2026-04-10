import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { Challenge, GamePlayer } from "../../types/game";
import type {
  FineDrinkEffect,
  MatchStatus,
  MiniGameResult,
  PersistentStatusEffect,
  PromptAudience,
} from "../types";
import {
  FINE_DRINK_BAD_EFFECTS,
  FINE_DRINK_GOOD_EFFECTS,
} from "./fineDrinkPrompts";

type Props = {
  challenge: Challenge;
  currentPlayer: GamePlayer;
  onComplete: (result: MiniGameResult) => void;
  fullScreen?: boolean;
};

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function isAudienceAllowedForPlayer(
  audience: PromptAudience,
  playerTag: "none" | "non_drinker",
): boolean {
  if (audience === "all") return true;
  if (audience === "drinkers_only") return playerTag !== "non_drinker";
  if (audience === "non_drinkers_only") return playerTag === "non_drinker";
  return true;
}

function getCompatibleEffects(
  effects: FineDrinkEffect[],
  currentPlayer: GamePlayer,
): FineDrinkEffect[] {
  return effects.filter((effect) =>
    isAudienceAllowedForPlayer(effect.audience, currentPlayer.tag),
  );
}

function toMatchStatus(
  effect: PersistentStatusEffect,
  currentPlayer: GamePlayer,
  challenge: Challenge,
): MatchStatus {
  return {
    id: `match_status_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    scope: effect.scope,
    playerId: effect.scope === "player" ? currentPlayer.id : undefined,
    playerName: effect.scope === "player" ? currentPlayer.name : undefined,
    text: effect.text,
    tone: effect.tone,
    sourceChallengeId: challenge.id,
    remainingRounds: effect.remainingRounds ?? null,
  };
}

export default function FineDrinkMiniGame({
  challenge,
  currentPlayer,
  onComplete,
  fullScreen = false,
}: Props) {
  const [phase, setPhase] = useState<"offer" | "revealed">("offer");
  const [visibleTone, setVisibleTone] = useState<"good" | "bad">("good");
  const [visibleEffect, setVisibleEffect] = useState<FineDrinkEffect | null>(
    null,
  );
  const [revealedEffect, setRevealedEffect] = useState<FineDrinkEffect | null>(
    null,
  );

  const finePrintOpacity = useRef(new Animated.Value(0)).current;
  const finePrintTranslateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    const nextVisibleTone: "good" | "bad" =
      Math.random() < 0.5 ? "good" : "bad";

    const sourcePool =
      nextVisibleTone === "good"
        ? getCompatibleEffects(FINE_DRINK_GOOD_EFFECTS, currentPlayer)
        : getCompatibleEffects(FINE_DRINK_BAD_EFFECTS, currentPlayer);

    const nextVisibleEffect =
      sourcePool.length > 0 ? randomItem(sourcePool) : null;

    setPhase("offer");
    setVisibleTone(nextVisibleTone);
    setVisibleEffect(nextVisibleEffect);
    setRevealedEffect(null);

    finePrintOpacity.setValue(0);
    finePrintTranslateY.setValue(16);
  }, [currentPlayer.id, challenge.id, finePrintOpacity, finePrintTranslateY]);

  const hiddenPool =
    visibleTone === "good"
      ? getCompatibleEffects(FINE_DRINK_BAD_EFFECTS, currentPlayer)
      : getCompatibleEffects(FINE_DRINK_GOOD_EFFECTS, currentPlayer);

  const handlePass = () => {
    onComplete({
      outcome: "passed",
      pointsAwarded: 0,
      statusText: `${currentPlayer.name} refused The Fine Drink after seeing a ${visibleTone} omen.`,
    });
  };

  const handleTakeDeal = () => {
    if (hiddenPool.length === 0) {
      onComplete({
        outcome: "passed",
        pointsAwarded: 0,
        statusText: `${currentPlayer.name} found no compatible fate in The Fine Drink.`,
      });
      return;
    }

    const hiddenEffect = randomItem(hiddenPool);

    finePrintOpacity.setValue(0);
    finePrintTranslateY.setValue(16);

    setRevealedEffect(hiddenEffect);
    setPhase("revealed");

    requestAnimationFrame(() => {
      Animated.parallel([
        Animated.timing(finePrintOpacity, {
          toValue: 1,
          duration: 420,
          delay: 120,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(finePrintTranslateY, {
          toValue: 0,
          duration: 420,
          delay: 120,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleAcceptRevealedEffect = () => {
    if (!visibleEffect || !revealedEffect) return;

    const appliedStatuses: MatchStatus[] = [];
    const immediateEffects: { text: string; tone: "good" | "bad" }[] = [];

    if (visibleEffect.type === "status") {
      appliedStatuses.push(
        toMatchStatus(visibleEffect, currentPlayer, challenge),
      );
    } else {
      immediateEffects.push({
        text: visibleEffect.text,
        tone: visibleEffect.tone,
      });
    }

    if (revealedEffect.type === "status") {
      appliedStatuses.push(
        toMatchStatus(revealedEffect, currentPlayer, challenge),
      );
    } else {
      immediateEffects.push({
        text: revealedEffect.text,
        tone: revealedEffect.tone,
      });
    }

    const summaryParts: string[] = [];

    if (immediateEffects.length > 0) {
      summaryParts.push(
        `Immediate: ${immediateEffects.map((effect) => effect.text).join(" ")}`,
      );
    }

    if (appliedStatuses.length > 0) {
      summaryParts.push(
        `Status: ${appliedStatuses.map((status) => status.text).join(" ")}`,
      );
    }

    onComplete({
      outcome: "completed",
      pointsAwarded: challenge.points,
      statusText:
        `${currentPlayer.name} accepted The Fine Drink. ` +
        summaryParts.join(" "),
      appliedStatuses,
      immediateEffects,
      payload: {
        visibleEffectText: visibleEffect.text,
        revealedEffectText: revealedEffect.text,
      },
    });
  };

  if (!visibleEffect) return null;

  return (
    <View style={[styles.root, fullScreen && styles.fullScreenRoot]}>
      <View style={styles.topThird}>
        <View style={styles.logoFrame}>
          <Image
            source={require("../../../assets/images/fdLogoPurple.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={styles.middleThird}>
        <Text style={styles.title}>{challenge.title}</Text>
        <Text style={styles.playerName}>{currentPlayer.name}</Text>

        {phase === "offer" && (
          <>
            <Text style={styles.phaseLabel}>
              {visibleTone === "good"
                ? "A blessing appears"
                : "A curse appears"}{" "}
              · {visibleEffect.type === "status" ? "Status" : "Action"}
            </Text>
            <Text style={styles.promptText}>{visibleEffect.text}</Text>
            <Text style={styles.helperText}>
              Take the deal to reveal the opposite fate.
            </Text>
          </>
        )}

        {phase === "revealed" && revealedEffect && (
          <>
            <Text style={styles.phaseLabel}>
              Contract Signed ·{" "}
              {visibleEffect.type === "status" ? "Status" : "Action"}
            </Text>
            <Text style={styles.promptTextRevealed}>{visibleEffect.text}</Text>

            <Animated.View
              style={[
                styles.finePrintBlock,
                {
                  opacity: finePrintOpacity,
                  transform: [{ translateY: finePrintTranslateY }],
                },
              ]}
            >
              <Text style={styles.finePrintLabel}>
                Fine Print ·{" "}
                {revealedEffect.type === "status" ? "Status" : "Action"}
              </Text>
              <Text style={styles.finePrintText}>{revealedEffect.text}</Text>
            </Animated.View>

            <Text style={styles.helperText}>
              Both effects apply if you continue.
            </Text>
          </>
        )}
      </View>

      <View style={styles.bottomThird}>
        {phase === "offer" && (
          <View style={styles.buttonRow}>
            <Pressable style={styles.secondaryButton} onPress={handlePass}>
              <Text style={styles.secondaryButtonText}>Leave It</Text>
            </Pressable>

            <Pressable style={styles.primaryButton} onPress={handleTakeDeal}>
              <Text style={styles.primaryButtonText}>Take It</Text>
            </Pressable>
          </View>
        )}

        {phase === "revealed" && (
          <Pressable
            style={styles.primaryButtonSingle}
            onPress={handleAcceptRevealedEffect}
          >
            <Text style={styles.primaryButtonText}>Continue</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  fullScreenRoot: {
    justifyContent: "space-between",
  },

  topThird: {
    flex: 1.1,
    alignItems: "center",
    justifyContent: "center",
  },
  middleThird: {
    flex: 1.2,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  bottomThird: {
    flex: 0.9,
    justifyContent: "flex-end",
    paddingBottom: 8,
  },

  logoFrame: {
    width: "100%",
    maxWidth: 280,
    height: 180,
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: "100%",
    height: "100%",
  },

  title: {
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 12,
  },
  playerName: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 14,
    opacity: 0.9,
  },
  phaseLabel: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    textAlign: "center",
    marginBottom: 12,
    opacity: 0.85,
  },
  promptText: {
    color: "#ffffff",
    fontSize: 24,
    lineHeight: 34,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 16,
  },
  helperText: {
    color: "#ffffff",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    opacity: 0.88,
    maxWidth: 320,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#ffffff",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonSingle: {
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#4a0059",
    fontWeight: "900",
    fontSize: 16,
  },
  secondaryButtonText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 16,
  },
  promptTextRevealed: {
    color: "#ffffff",
    fontSize: 22,
    lineHeight: 32,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
    opacity: 0.82,
  },

  finePrintBlock: {
    marginTop: 6,
    marginBottom: 16,
    paddingTop: 12,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
  },

  finePrintLabel: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
    textTransform: "uppercase",
    opacity: 0.8,
    marginBottom: 8,
  },

  finePrintText: {
    color: "#ffffff",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    textAlign: "center",
    opacity: 0.95,
    maxWidth: 320,
  },
});
