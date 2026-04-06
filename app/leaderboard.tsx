import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import ScreenContainer from "../src/components/ScreenContainer";
import { mockGameModes } from "../src/data/mockGameModes";
import { mockPlayers } from "../src/data/mockPlayers";
import { useGameStore } from "../src/state/gameStore";
import type { LeaderboardEntry } from "../src/types/game";

type LeaderboardView = "solo" | "team";
type GameModeFilter = "all" | string;

export default function LeaderboardScreen() {
  const { leaderboardEntries } = useGameStore();

  const [viewType, setViewType] = useState<LeaderboardView>("solo");
  const [modeFilter, setModeFilter] = useState<GameModeFilter>("all");

  const filteredEntries = useMemo(() => {
    let entries = leaderboardEntries.filter((entry) => entry.type === viewType);

    if (modeFilter !== "all") {
      entries = entries.filter((entry) => entry.gameModeId === modeFilter);
    }

    return [...entries].sort((a, b) => b.score - a.score);
  }, [leaderboardEntries, viewType, modeFilter]);

  const getPlayerName = (playerProfileId?: string, fallbackName?: string) => {
    if (!playerProfileId) return fallbackName ?? "Unknown Player";
    return (
      mockPlayers.find((player) => player.id === playerProfileId)?.name ??
      fallbackName ??
      "Unknown Player"
    );
  };

  const getGameModeName = (gameModeId?: string) => {
    if (!gameModeId) return "Unknown Mode";
    return (
      mockGameModes.find((mode) => mode.id === gameModeId)?.name ?? gameModeId
    );
  };

  const renderLeaderboardItem = ({
    item,
    index,
  }: {
    item: LeaderboardEntry;
    index: number;
  }) => {
    const displayName =
      item.type === "team"
        ? (item.teamName ?? "Unknown Team")
        : getPlayerName(item.playerProfileId, item.teamName);

    return (
      <View style={styles.entryCard}>
        <View style={styles.rankBadge}>
          <Text style={styles.rankBadgeText}>{index + 1}</Text>
        </View>

        <View style={styles.entryInfo}>
          <Text style={styles.entryName}>{displayName}</Text>
          <Text style={styles.entryMeta}>
            Mode: {getGameModeName(item.gameModeId)}
          </Text>
        </View>

        <View style={styles.entryStats}>
          <Text style={styles.entryScore}>{item.score}</Text>
          <Text style={styles.entryWins}>{item.wins ?? 0} wins</Text>
        </View>
      </View>
    );
  };

  return (
    <ScreenContainer>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.title}>Leaderboard</Text>
          <Text style={styles.subtitle}>
            See the top scores by mode and type.
          </Text>
        </View>

        <Pressable
          style={styles.backButton}
          onPress={() => router.push("/menu")}
        >
          <Text style={styles.backButtonText}>Menu</Text>
        </Pressable>
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Type</Text>
        <View style={styles.toggleRow}>
          <Pressable
            style={[
              styles.toggleButton,
              viewType === "solo" && styles.toggleButtonActive,
            ]}
            onPress={() => setViewType("solo")}
          >
            <Text style={styles.toggleButtonText}>Solo</Text>
          </Pressable>

          <Pressable
            style={[
              styles.toggleButton,
              viewType === "team" && styles.toggleButtonActive,
            ]}
            onPress={() => setViewType("team")}
          >
            <Text style={styles.toggleButtonText}>Team</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Game Mode</Text>
        <View style={styles.modeFilterWrap}>
          <Pressable
            style={[
              styles.modeChip,
              modeFilter === "all" && styles.modeChipActive,
            ]}
            onPress={() => setModeFilter("all")}
          >
            <Text style={styles.modeChipText}>All</Text>
          </Pressable>

          {mockGameModes.map((mode) => (
            <Pressable
              key={mode.id}
              style={[
                styles.modeChip,
                modeFilter === mode.id && styles.modeChipActive,
              ]}
              onPress={() => setModeFilter(mode.id)}
            >
              <Text style={styles.modeChipText}>{mode.name}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.listSection}>
        {filteredEntries.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No entries found</Text>
            <Text style={styles.emptyStateText}>
              Try another type or game mode filter.
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredEntries}
            keyExtractor={(item) => item.id}
            renderItem={renderLeaderboardItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    gap: 12,
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
  backButton: {
    backgroundColor: "#1f1f1f",
    borderWidth: 1,
    borderColor: "#333333",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  backButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  filterSection: {
    marginBottom: 18,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 10,
  },
  toggleRow: {
    flexDirection: "row",
    gap: 10,
  },
  toggleButton: {
    flex: 1,
    backgroundColor: "#1d1d1d",
    borderWidth: 1,
    borderColor: "#313131",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  toggleButtonActive: {
    backgroundColor: "#2b2144",
    borderColor: "#8b5cf6",
  },
  toggleButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  modeFilterWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  modeChip: {
    backgroundColor: "#1d1d1d",
    borderWidth: 1,
    borderColor: "#313131",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  modeChipActive: {
    backgroundColor: "#2b2144",
    borderColor: "#8b5cf6",
  },
  modeChipText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  listSection: {
    flex: 1,
    backgroundColor: "#171717",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    padding: 10,
  },
  listContent: {
    paddingBottom: 8,
  },
  entryCard: {
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
  entryInfo: {
    flex: 1,
  },
  entryName: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4,
  },
  entryMeta: {
    color: "#aaaaaa",
    fontSize: 12,
  },
  entryStats: {
    alignItems: "flex-end",
    marginLeft: 12,
  },
  entryScore: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
  },
  entryWins: {
    color: "#b5b5b5",
    fontSize: 12,
    marginTop: 2,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
  },
  emptyStateText: {
    color: "#aaaaaa",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
