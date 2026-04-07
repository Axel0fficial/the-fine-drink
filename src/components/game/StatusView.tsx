import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  statusText: string;
};

export default function StatusView({ statusText }: Props) {
  return (
    <View style={styles.statusCard}>
      <Text style={styles.statusLabel}>Status</Text>
      <Text style={styles.statusText}>{statusText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
});