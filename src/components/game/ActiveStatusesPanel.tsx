import React from "react";
import { ScrollView, Text, View } from "react-native";
import type { MatchStatus } from "../../minigames/types";
import { gameSharedStyles as styles } from "../style/gameSharedStyles";

type Props = {
  statuses: MatchStatus[];
};

export default function ActiveStatusesPanel({ statuses }: Props) {
  if (statuses.length === 0) return null;

  return (
    <View style={styles.statusPanel}>
      <Text style={styles.statusPanelTitle}>Active Statuses</Text>

      <ScrollView
        style={styles.statusPanelScroll}
        contentContainerStyle={styles.statusPanelContent}
        nestedScrollEnabled
        showsVerticalScrollIndicator
      >
        {statuses.map((status) => (
          <Text
            key={status.id}
            style={[
              styles.activeStatusLine,
              status.tone === "good"
                ? styles.activeStatusLineGood
                : styles.activeStatusLineBad,
            ]}
            numberOfLines={3}
          >
            {status.scope === "global"
              ? "Global:"
              : `${status.playerName ?? "Player"}:`}{" "}
            {status.text}
            {status.remainingRounds != null
              ? ` (${status.remainingRounds} round${
                  status.remainingRounds === 1 ? "" : "s"
                } left)`
              : ""}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}
