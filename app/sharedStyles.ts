import { StyleSheet } from "react-native";

const COLORS = {
  black: "#000000",
  blackSoft: "#0a0a0a",
  blackCard: "#111111",
  purple: "#8b5cf6",
  purpleDark: "#140d22",
  white: "#ffffff",
  textMuted: "#aaaaaa",
  textSoft: "#b5b5b5",
  textDisabled: "#d3cbe9",
  overlay: "rgba(0,0,0,0.82)",
  dangerBg: "#2a1616",
  dangerBorder: "#7f1d1d",
  dangerText: "#f0b4b4",
};

export const sharedStyles = StyleSheet.create({
  // Base screen helpers
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
    paddingHorizontal: 18,
  },

  header: {
    marginBottom: 24,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.white,
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textSoft,
  },

  section: {
    backgroundColor: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.purple,
    borderRadius: 16,
    padding: 16,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.white,
    marginBottom: 8,
  },

  sectionText: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textMuted,
  },

  // Top bars / navigation
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 20,
  },

  topNav: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 22,
  },

  topNavButton: {
    flex: 1,
    backgroundColor: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.purple,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  topNavButtonActive: {
    borderColor: COLORS.purple,
    backgroundColor: COLORS.purpleDark,
  },

  topNavButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },

  // Buttons
  primaryButton: {
    backgroundColor: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.purple,
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 15,
  },

  primaryButtonDisabled: {
    opacity: 0.35,
  },

  primaryButtonTextDisabled: {
    color: COLORS.textDisabled,
  },

  secondaryButton: {
    backgroundColor: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.purple,
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonText: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 15,
  },

  smallActionButton: {
    backgroundColor: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.purple,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },

  smallActionButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "700",
  },

  dangerButton: {
    backgroundColor: COLORS.dangerBg,
    borderWidth: 1,
    borderColor: COLORS.dangerBorder,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  dangerButtonText: {
    color: COLORS.dangerText,
    fontWeight: "800",
    fontSize: 15,
  },

  // Inputs
  input: {
    backgroundColor: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.purple,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: COLORS.white,
    fontSize: 16,
  },

  textArea: {
    minHeight: 110,
    textAlignVertical: "top",
  },

  inputLabel: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },

  // Cards / lists
  card: {
    backgroundColor: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.purple,
    borderRadius: 16,
    padding: 14,
  },

  flatCard: {
    backgroundColor: COLORS.black,
    borderWidth: 0,
    borderRadius: 16,
    padding: 14,
  },

  listCard: {
    backgroundColor: COLORS.black,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 0,
  },

  outlinedListCard: {
    backgroundColor: COLORS.black,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.purple,
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 28,
  },

  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.white,
    marginBottom: 8,
  },

  emptyStateText: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: "center",
    padding: 18,
  },

  modalCard: {
    maxHeight: "82%",
    backgroundColor: COLORS.black,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.purple,
    padding: 16,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  modalTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "800",
  },

  modalCloseText: {
    color: COLORS.purple,
    fontSize: 15,
    fontWeight: "700",
  },

  modalDescription: {
    color: COLORS.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },

  // Chips / tags
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  chip: {
    backgroundColor: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.purple,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  chipActive: {
    backgroundColor: COLORS.purpleDark,
    borderColor: COLORS.purple,
  },

  chipText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "700",
  },

  // Utility rows
  row: {
    flexDirection: "row",
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  bottomActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
});

export { COLORS };

