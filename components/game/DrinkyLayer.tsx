import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

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
      <View style={styles.imageFrame}>
        <ImageBackground
          source={event.image}
          style={styles.image}
          resizeMode="contain"
        >
          <View style={styles.textBox}>
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
        </ImageBackground>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
  },

  imageFrame: {
    width: "100%",
    aspectRatio: 16 / 9,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  textBox: {
    position: "absolute",

    // aligned to the black box in the PNG
    left: "2%",
    right: "2%",
    bottom: "4%",
    height: "18%",

    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    justifyContent: "center",
  },
  text: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 20,
  },
  extraChallengeBox: {
    marginTop: spacing.sm,
  },
  extraChallengeTitle: {
    color: colors.text,
    fontWeight: "bold",
    marginBottom: 2,
  },
  extraChallengeText: {
    color: colors.mutedText,
    lineHeight: 18,
    fontSize: 13,
  },
  acceptButton: {
    alignSelf: "flex-start",
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginTop: spacing.sm,
  },
  acceptText: {
    color: colors.text,
    fontWeight: "bold",
    fontSize: 13,
  },
  hideButton: {
    position: "absolute",
    right: spacing.sm,
    bottom: spacing.sm,
  },
  hideText: {
    color: colors.primaryLight,
    fontWeight: "bold",
    fontSize: 13,
  },
  showButton: {
    position: "absolute",
    right: spacing.lg,
    bottom: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    paddingVertical: 10,
    paddingHorizontal: 14,
    zIndex: 60,
  },
  showButtonText: {
    color: colors.text,
    fontWeight: "bold",
  },
});
