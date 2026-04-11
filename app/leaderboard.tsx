import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS, sharedStyles } from "../app/sharedStyles";
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
      <View style={sharedStyles.topBar}>
        <View>
          <Text style={sharedStyles.title}>Leaderboard</Text>
          <Text style={sharedStyles.subtitle}>
            See the top scores by mode and type.
          </Text>
        </View>

        <Pressable
          style={sharedStyles.smallActionButton}
          onPress={() => router.push("/menu")}
        >
          <Text style={sharedStyles.smallActionButtonText}>Menu</Text>
        </Pressable>
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Type</Text>

        <View style={styles.toggleRow}>
          <Pressable
            style={[
              sharedStyles.topNavButton,
              styles.toggleButton,
              viewType === "solo" && sharedStyles.topNavButtonActive,
            ]}
            onPress={() => setViewType("solo")}
          >
            <Text style={sharedStyles.topNavButtonText}>Solo</Text>
          </Pressable>

          <Pressable
            style={[
              sharedStyles.topNavButton,
              styles.toggleButton,
              viewType === "team" && sharedStyles.topNavButtonActive,
            ]}
            onPress={() => setViewType("team")}
          >
            <Text style={sharedStyles.topNavButtonText}>Team</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Game Mode</Text>

        <View style={styles.modeFilterWrap}>
          <Pressable
            style={[
              sharedStyles.chip,
              modeFilter === "all" && sharedStyles.chipActive,
            ]}
            onPress={() => setModeFilter("all")}
          >
            <Text style={sharedStyles.chipText}>All</Text>
          </Pressable>

          {mockGameModes.map((mode) => (
            <Pressable
              key={mode.id}
              style={[
                sharedStyles.chip,
                modeFilter === mode.id && sharedStyles.chipActive,
              ]}
              onPress={() => setModeFilter(mode.id)}
            >
              <Text style={sharedStyles.chipText}>{mode.name}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.listSection}>
        {filteredEntries.length === 0 ? (
          <View style={sharedStyles.emptyState}>
            <Text style={sharedStyles.emptyStateTitle}>No entries found</Text>
            <Text style={sharedStyles.emptyStateText}>
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
  },

  modeFilterWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  listSection: {
    flex: 1,
    backgroundColor: COLORS.black,
    borderRadius: 16,
    borderWidth: 0,
    padding: 10,
  },

  listContent: {
    paddingBottom: 8,
  },

  entryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.black,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.purple,
  },

  rankBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.purple,
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
});
