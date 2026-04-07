import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  onPass: () => void;
  onDone: () => void;
  doneDisabled: boolean;
};

export default function GameActions({
  onPass,
  onDone,
  doneDisabled,
}: Props) {
  return (
    <View style={styles.bottomRow}>
      <Pressable style={styles.passButton} onPress={onPass}>
        <Text style={styles.passButtonText}>Pass</Text>
      </Pressable>

      <Pressable
        style={[styles.doneButton, doneDisabled && styles.doneButtonDisabled]}
        onPress={onDone}
        disabled={doneDisabled}
      >
        <Text style={styles.doneButtonText}>Done</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
});