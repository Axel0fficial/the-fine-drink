import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/style/theme";
import { PlayerStatus } from "@/types/game";

type ResolvedFineDrinkData = {
  offerStatus: PlayerStatus;
  hiddenStatus: PlayerStatus;
};

type FineDrinkMinigameProps = {
  data: ResolvedFineDrinkData;
  playerName: string;
  onDecline: () => void;
  onAccept: (statuses: PlayerStatus[]) => void;
};

export default function FineDrinkMinigame({
  data,
  playerName,
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
      <Image
        source={require("@/assets/images/the_fine_drink_logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.offerBox}>
        <Text style={styles.offerIntro}>{playerName}, I offer you:</Text>

        <Text style={styles.offerTitle}>{data.offerStatus.name}</Text>

        <Text style={styles.offerDescription}>
          {data.offerStatus.description}
        </Text>

        <Text style={styles.rounds}>
          Lasts {data.offerStatus.remainingRounds} rounds
        </Text>

        {accepted && (
          <View style={styles.revealBox}>
            <Text style={styles.revealLabel}>But also...</Text>

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
            <Text style={styles.declineText}>Decline</Text>
          </Pressable>

          <Pressable style={styles.acceptButton} onPress={handleAccept}>
            <Text style={styles.acceptText}>Accept</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueText}>Continue</Text>
        </Pressable>
      )}
    </View>
  );
}

const fineDrinkPurple = "#6d00b6";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: fineDrinkPurple,
    padding: spacing.xl,
    paddingTop: 70,
    justifyContent: "space-between",
  },
  logo: {
    width: "100%",
    height: 150,
    alignSelf: "center",
  },
  offerBox: {
    backgroundColor: fineDrinkPurple,
    borderColor: "rgba(255,255,255,0.22)",
    borderWidth: 1,
    borderRadius: radius.xl,
    padding: spacing.xl,
  },
  offerIntro: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  offerTitle: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
  hiddenTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  offerDescription: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
    lineHeight: 30,
    marginTop: spacing.lg,
  },
  rounds: {
    color: "rgba(255,255,255,0.75)",
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
  revealLabel: {
    color: "#FFD84A",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: spacing.md,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  declineButton: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: "center",
    borderColor: "rgba(255,255,255,0.3)",
    borderWidth: 1,
  },
  declineText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: "#fff",
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: "center",
  },
  acceptText: {
    color: fineDrinkPurple,
    fontWeight: "bold",
    fontSize: 18,
  },
  continueButton: {
    backgroundColor: "#fff",
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: "center",
  },
  continueText: {
    color: fineDrinkPurple,
    fontSize: 18,
    fontWeight: "bold",
  },
});
