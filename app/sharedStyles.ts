import { StyleSheet } from "react-native";

export const sharedStyles = StyleSheet.create({
  // Base screen helpers
  screenContainer: {
    flex: 1,
    backgroundColor: "#111111",
    paddingHorizontal: 18,
  },

  header: {
    marginBottom: 24,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#ffffff",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: "#b5b5b5",
  },

  section: {
    backgroundColor: "#171717",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 16,
    padding: 16,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 8,
  },

  sectionText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#aaaaaa",
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
    backgroundColor: "#1f1f1f",
    borderWidth: 1,
    borderColor: "#333333",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  topNavButtonActive: {
    borderColor: "#8b5cf6",
    backgroundColor: "#2b2144",
  },

  topNavButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },

  // Buttons
  primaryButton: {
    backgroundColor: "#8b5cf6",
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 15,
  },

  primaryButtonDisabled: {
    backgroundColor: "#3b3159",
    opacity: 0.5,
  },

  primaryButtonTextDisabled: {
    color: "#d3cbe9",
  },

  secondaryButton: {
    backgroundColor: "#2b2b2b",
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 15,
  },

  smallActionButton: {
    backgroundColor: "#1f1f1f",
    borderWidth: 1,
    borderColor: "#333333",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },

  smallActionButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },

  // Inputs
  input: {
    backgroundColor: "#1b1b1b",
    borderWidth: 1,
    borderColor: "#313131",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: "#ffffff",
    fontSize: 16,
  },

  textArea: {
    minHeight: 110,
    textAlignVertical: "top",
  },

  inputLabel: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },

  // Cards / lists
  card: {
    backgroundColor: "#171717",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 16,
    padding: 14,
  },

  listCard: {
    backgroundColor: "#202020",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#2f2f2f",
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
    color: "#ffffff",
    marginBottom: 8,
  },

  emptyStateText: {
    fontSize: 14,
    color: "#aaaaaa",
    textAlign: "center",
    lineHeight: 20,
  },

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.72)",
    justifyContent: "center",
    padding: 18,
  },

  modalCard: {
    maxHeight: "82%",
    backgroundColor: "#151515",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#303030",
    padding: 16,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  modalTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
  },

  modalCloseText: {
    color: "#8b5cf6",
    fontSize: 15,
    fontWeight: "700",
  },

  modalDescription: {
    color: "#aaaaaa",
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
    backgroundColor: "#202020",
    borderWidth: 1,
    borderColor: "#313131",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  chipActive: {
    backgroundColor: "#2b2144",
    borderColor: "#8b5cf6",
  },

  chipText: {
    color: "#ffffff",
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