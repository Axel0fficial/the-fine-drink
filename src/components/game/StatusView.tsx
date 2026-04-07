import React from "react";
import { Text, View } from "react-native";
import { gameSharedStyles as styles } from "../style/gameSharedStyles";

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