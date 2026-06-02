import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, sharedStyles, spacing } from "@/style/theme";
import { PlayerStatus } from "@/types/game";

type ResolvedFineDrinkData = {
  offerStatus: PlayerStatus;
  hiddenStatus: PlayerStatus;
};

type FineDrinkMinigameProps = {
  data: ResolvedFineDrinkData;
  onDecline: () => void;
  onAccept: (statuses: PlayerStatus[]) => void;
};

export default function FineDrinkMinigame({
  data,
  onDecline,
  onAccept,
}: FineDrinkMinigameProps) {
  const [accepted, setAccepted] = useState(false);

  function handleAccept() {
    setAccepted(true);
  }

  function handleContinue() {
    onAccept([data.offerStatus, data.hiddenStatus]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>The Fine Drink</Text>

      <View style={styles.offerBox}>
        <Text style={styles.label}>The offer:</Text>

        <Text style={styles.offerTitle}>{data.offerStatus.name}</Text>

        <Text style={styles.offerDescription}>
          {data.offerStatus.description}
        </Text>

        <Text style={styles.rounds}>
          Lasts {data.offerStatus.remainingRounds} rounds
        </Text>

        {accepted && (
          <View style={styles.revealBox}>
            <Text style={styles.label}>But also...</Text>

            <Text style={styles.hiddenTitle}>{data.hiddenStatus.name}</Text>

            <Text style={styles.offerDescription}>
              {data.hiddenStatus.description}
            </Text>

            <Text style={styles.rounds}>
              Lasts {data.hiddenStatus.remainingRounds} rounds
            </Text>
          </View>
        )}
      </View>

      {!accepted ? (
        <View style={styles.actions}>
          <Pressable style={styles.declineButton} onPress={onDecline}>
            <Text style={sharedStyles.buttonText}>Decline</Text>
          </Pressable>

          <Pressable style={styles.acceptButton} onPress={handleAccept}>
            <Text style={sharedStyles.buttonText}>Accept</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable style={styles.continueButton} onPress={handleContinue}>
          <Text style={sharedStyles.buttonText}>Continue</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: spacing.xl,
    paddingTop: 80,
    justifyContent: "space-between",
  },
  logo: {
    color: colors.text,
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
  },
  offerBox: {
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: radius.xl,
    padding: spacing.xl,
  },
  label: {
    color: colors.primaryLight,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: spacing.md,
  },
  offerTitle: {
    color: colors.text,
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
  },
  hiddenTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  offerDescription: {
    color: colors.text,
    fontSize: 20,
    textAlign: "center",
    lineHeight: 30,
    marginTop: spacing.lg,
  },
  rounds: {
    color: colors.mutedText,
    fontSize: 16,
    textAlign: "center",
    marginTop: spacing.lg,
  },
  revealBox: {
    marginTop: spacing.xl,
    paddingTop: spacing.xl,
    borderTopColor: "rgba(255,255,255,0.25)",
    borderTopWidth: 1,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  declineButton: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: "center",
  },
  acceptButton: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: "center",
  },
  continueButton: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: "center",
  },
});
