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
          <View
            key={status.id}
            style={[
              styles.activeStatusCard,
              status.tone === "good"
                ? styles.activeStatusCardGood
                : styles.activeStatusCardBad,
            ]}
          >
            <Text style={styles.activeStatusHeader}>
              {status.scope === "global"
                ? "Global"
                : (status.playerName ?? "Player")}
            </Text>

            <Text style={styles.activeStatusText}>{status.text}</Text>

            {status.remainingRounds != null && (
              <Text style={styles.activeStatusRounds}>
                {status.remainingRounds} round
                {status.remainingRounds === 1 ? "" : "s"} left
              </Text>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
