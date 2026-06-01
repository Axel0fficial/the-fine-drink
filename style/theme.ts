import { StyleSheet } from "react-native";

export const colors = {
  background: "#000",
  surface: "#111",
  surfaceLight: "#222",
  border: "#333",
  primary: "#510996",
  primaryLight: "#b57cff",
  text: "#fff",
  mutedText: "#aaa",
  darkMutedText: "#777",
};

export const spacing = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 40,
};

export const radius = {
  md: 12,
  lg: 14,
  xl: 20,
};

export const sharedStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  centeredScreen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  title: {
    color: colors.text,
    fontSize: 36,
    fontWeight: "bold",
  },
  centeredTitle: {
    color: colors.text,
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    color: colors.mutedText,
    fontSize: 16,
    textAlign: "center",
    marginTop: spacing.md,
    marginBottom: spacing.xxl,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: colors.surfaceLight,
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: "center",
  },
  buttonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.lg,
    fontSize: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
});
