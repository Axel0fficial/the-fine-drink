import { StyleSheet } from "react-native";

export const gameSharedStyles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#ffffff",
  },

  turnText: {
    marginTop: 4,
    fontSize: 14,
    color: "#b5b5b5",
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },

  finishButton: {
    backgroundColor: "#2b2b2b",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },

  finishButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },

  infoRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },

  infoCard: {
    flex: 1,
    backgroundColor: "#171717",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 14,
    padding: 14,
  },

  infoLabel: {
    color: "#9ca3af",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 6,
  },

  infoValue: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },

  scoreCard: {
    backgroundColor: "#1d1d1d",
    borderWidth: 1,
    borderColor: "#313131",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
  },

  scoreLabel: {
    color: "#9ca3af",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6,
    textTransform: "uppercase",
  },

  scoreValue: {
    color: "#8b5cf6",
    fontSize: 32,
    fontWeight: "900",
  },

  challengeSwitchRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },

  challengeToggle: {
    flex: 1,
    backgroundColor: "#222222",
    borderWidth: 1,
    borderColor: "#313131",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },

  challengeToggleActive: {
    backgroundColor: "#2b2144",
    borderColor: "#8b5cf6",
  },

  challengeToggleDisabled: {
    opacity: 0.45,
  },

  challengeToggleText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
  },

  challengeCard: {
    flex: 1,
    backgroundColor: "#171717",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
  },

  challengeTitle: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 8,
  },

  challengeMeta: {
    color: "#8b8b8b",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },

  challengeDescription: {
    color: "#f3f3f3",
    fontSize: 18,
    lineHeight: 28,
  },

  statusCard: {
    backgroundColor: "#171717",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },

  statusLabel: {
    color: "#9ca3af",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 6,
  },

  statusText: {
    color: "#ffffff",
    fontSize: 14,
    lineHeight: 20,
  },

  bottomRow: {
    flexDirection: "row",
    gap: 12,
  },

  passButton: {
    flex: 1,
    backgroundColor: "#2b2b2b",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  passButtonText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 15,
  },

  doneButton: {
    flex: 1,
    backgroundColor: "#8b5cf6",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  doneButtonDisabled: {
    backgroundColor: "#3b3159",
    opacity: 0.5,
  },

  doneButtonText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 15,
  },

  emptyText: {
    marginTop: 12,
    fontSize: 15,
    color: "#b5b5b5",
  },

  backButton: {
    marginTop: 18,
    backgroundColor: "#2b2b2b",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  backButtonText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 15,
  },
});