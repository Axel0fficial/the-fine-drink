import { colors, radius, spacing } from "@/style/theme";
import { StyleSheet, Text, View } from "react-native";

export default function DrinkyLayer() {
  return (
    <View pointerEvents="none" style={styles.container}>
      <View style={styles.bubble}>
        <Text style={styles.text}>Drinky</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: spacing.lg,
    bottom: spacing.lg,
  },
  bubble: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    paddingVertical: 10,
    paddingHorizontal: 16,
    opacity: 0.85,
  },
  text: {
    color: colors.text,
    fontWeight: "bold",
  },
});
