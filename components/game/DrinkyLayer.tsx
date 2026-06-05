import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/style/theme";
import { DrinkyEvent } from "@/types/game";

type DrinkyLayerProps = {
  event: DrinkyEvent | null;
  hidden: boolean;
  onHide: () => void;
  onShow: () => void;
  onAcceptStatus?: () => void;
};
export default function DrinkyLayer({
  event,
  hidden,
  onHide,
  onShow,
  onAcceptStatus,
}: DrinkyLayerProps) {
  if (!event) return null;

  if (hidden) {
    return (
      <Pressable style={styles.showButton} onPress={onShow}>
        <Text style={styles.showButtonText}>Drinky</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.container} pointerEvents="box-none">
      <View style={styles.bubble}>
        <Text style={styles.text}>{event.text}</Text>
        {event.extraChallenge && (
          <View style={styles.extraChallengeBox}>
            <Text style={styles.extraChallengeTitle}>
              {event.extraChallenge.title}
            </Text>

            <Text style={styles.extraChallengeText}>
              {event.extraChallenge.description}
            </Text>
          </View>
        )}

        {event.type === "grantStatus" && event.statusEffect && (
          <Pressable style={styles.acceptButton} onPress={onAcceptStatus}>
            <Text style={styles.acceptText}>Accept Status</Text>
          </Pressable>
        )}

        <Pressable style={styles.hideButton} onPress={onHide}>
          <Text style={styles.hideText}>Hide</Text>
        </Pressable>
      </View>

      <Image source={event.image} style={styles.image} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 210,
    pointerEvents: "box-none",
  },
  extraChallengeBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    borderColor: colors.primaryLight,
    borderWidth: 1,
  },
  extraChallengeTitle: {
    color: colors.text,
    fontWeight: "bold",
    marginBottom: 4,
  },
  extraChallengeText: {
    color: colors.mutedText,
    lineHeight: 20,
  },
  acceptButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginTop: spacing.md,
    alignItems: "center",
  },
  acceptText: {
    color: colors.text,
    fontWeight: "bold",
  },
  image: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 180,
    height: 220,
  },
  bubble: {
    position: "absolute",
    left: spacing.md,
    right: 120,
    bottom: spacing.lg,
    backgroundColor: "#000",
    borderRadius: radius.lg,
    padding: spacing.md,
    borderColor: colors.primaryLight,
    borderWidth: 1,
    zIndex: 2,
  },
  text: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 21,
  },
  hideButton: {
    alignSelf: "flex-end",
    marginTop: spacing.sm,
  },
  hideText: {
    color: colors.primaryLight,
    fontWeight: "bold",
  },
  showButton: {
    position: "absolute",
    right: spacing.lg,
    bottom: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  showButtonText: {
    color: colors.text,
    fontWeight: "bold",
  },
});
