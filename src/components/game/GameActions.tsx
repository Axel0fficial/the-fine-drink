import React from "react";
import { Pressable, Text, View } from "react-native";
import { gameSharedStyles as styles } from "../style/gameSharedStyles";

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