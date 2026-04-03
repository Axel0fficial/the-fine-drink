import { router } from "expo-router";
import React, { useMemo } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import ScreenContainer from "../src/components/ScreenContainer";
import { useGameStore } from "../src/state/gameStore";
import type { GamePlayer } from "../src/types/game";

export default function WinnerScreen() {
  const { selectedPlayers } = useGameStore();

  const sortedPlayers = useMemo(() => {
    return [...selectedPlayers].sort((a, b) => b.score - a.score);
  }, [selectedPlayers]);

  const winner = sortedPlayers[0] ?? null;

  const renderScoreItem = ({
    item,
    index,
  }: {
    item: GamePlayer;
    index: number;
  }) => {
    return (
      <View style={styles.scoreRow}>
        <View style={styles.rankBadge}>
          <Text style={styles.rankBadgeText}>{index + 1}</Text>
        </View>

        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>{item.name}</Text>
          <Text style={styles.playerMeta}>
            {item.team !== "none" ? `Team: ${item.team}` : "Solo"}
          </Text>
        </View>

        <Text style={styles.playerScore}>{item.score}</Text>
      </View>
    );
  };

  if (!winner) {
    return (
      <ScreenContainer>
        <Text style={styles.title}>Winner</Text>
        <Text style={styles.emptyText}>No finished game data found.</Text>

        <Pressable
          style={styles.primaryButton}
          onPress={() => router.push("/menu")}
        >
          <Text style={styles.primaryButtonText}>Back to Menu</Text>
        </Pressable>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>Winner</Text>
      <Text style={styles.subtitle}>
        The game is over. Here are the results.
      </Text>

      <View style={styles.winnerCard}>
        <Text style={styles.winnerLabel}>Winner / King</Text>
        <Text style={styles.winnerName}>{winner.name}</Text>
        <Text style={styles.winnerScore}>{winner.score} points</Text>
      </View>

      <View style={styles.scoreboardSection}>
        <Text style={styles.sectionTitle}>Scoreboard</Text>

        <FlatList
          data={sortedPlayers}
          keyExtractor={(item) => item.id}
          renderItem={renderScoreItem}
          contentContainerStyle={styles.scoreboardList}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <View style={styles.bottomActions}>
        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.push("/menu")}
        >
          <Text style={styles.secondaryButtonText}>Menu</Text>
        </Pressable>

        <Pressable
          style={styles.primaryButton}
          onPress={() => router.push("/leaderboard")}
        >
          <Text style={styles.primaryButtonText}>Leaderboard</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111111",
    paddingHorizontal: 18,
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
    marginBottom: 18,
  },
  winnerCard: {
    backgroundColor: "#2b2144",
    borderWidth: 1,
    borderColor: "#8b5cf6",
    borderRadius: 18,
    paddingVertical: 22,
    paddingHorizontal: 18,
    alignItems: "center",
    marginBottom: 18,
  },
  winnerLabel: {
    color: "#d8cfff",
    fontSize: 13,
    marginBottom: 8,
  },
  winnerName: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 6,
    textAlign: "center",
  },
  winnerScore: {
    color: "#f3edff",
    fontSize: 18,
    fontWeight: "700",
  },
  scoreboardSection: {
    flex: 1,
    backgroundColor: "#171717",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    padding: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 10,
  },
  scoreboardList: {
    paddingBottom: 8,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#202020",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#2f2f2f",
  },
  rankBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#8b5cf6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  rankBadgeText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4,
  },
  playerMeta: {
    color: "#aaaaaa",
    fontSize: 12,
  },
  playerScore: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "900",
    marginLeft: 12,
  },
  bottomActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#2b2b2b",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 15,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#8b5cf6",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 15,
  },
  emptyText: {
    color: "#ffffff",
    fontSize: 18,
    marginTop: 20,
    marginBottom: 20,
  },
});
