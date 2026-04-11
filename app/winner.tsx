import { router } from "expo-router";
import React, { useEffect, useMemo } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS, sharedStyles } from "../app/sharedStyles";
import ScreenContainer from "../src/components/ScreenContainer";
import { useGameStore } from "../src/state/gameStore";
import type { LeaderboardEntry, TeamColor } from "../src/types/game";

type TeamResult = {
  id: string;
  team: TeamColor;
  score: number;
  members: string[];
};

function capLeaderboard(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  const solo = entries
    .filter((entry) => entry.type === "solo")
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);

  const team = entries
    .filter((entry) => entry.type === "team")
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);

  return [...solo, ...team];
}

export default function WinnerScreen() {
  const {
    selectedPlayers,
    selectedGameModeId,
    leaderboardEntries,
    setLeaderboardEntries,
    resetMatchScores,
  } = useGameStore();

  const handleBackToMenu = () => {
    resetMatchScores();
    router.push("/menu");
  };

  const handleGoToLeaderboard = () => {
    resetMatchScores();
    router.push("/leaderboard");
  };

  const sortedPlayers = useMemo(() => {
    return [...selectedPlayers].sort((a, b) => b.score - a.score);
  }, [selectedPlayers]);

  const teamResults = useMemo<TeamResult[]>(() => {
    const map = new Map<TeamColor, TeamResult>();

    for (const player of selectedPlayers) {
      if (player.team === "none") continue;

      const existing = map.get(player.team);
      if (existing) {
        existing.score += player.score;
        existing.members.push(player.name);
      } else {
        map.set(player.team, {
          id: `team_${player.team}`,
          team: player.team,
          score: player.score,
          members: [player.name],
        });
      }
    }

    return [...map.values()].sort((a, b) => b.score - a.score);
  }, [selectedPlayers]);

  const isTeamMatch = teamResults.length > 0;

  const winnerPlayer = sortedPlayers[0] ?? null;
  const winnerTeam = teamResults[0] ?? null;

  useEffect(() => {
    if (!selectedGameModeId) return;

    if (isTeamMatch) {
      if (!winnerTeam) return;

      const entryId = `team_${selectedGameModeId}_${winnerTeam.team}_${winnerTeam.score}`;

      const alreadyExists = leaderboardEntries.some(
        (entry) => entry.id === entryId,
      );
      if (alreadyExists) return;

      const newEntry: LeaderboardEntry = {
        id: entryId,
        type: "team",
        teamName: winnerTeam.team,
        score: winnerTeam.score,
        wins: 1,
        gameModeId: selectedGameModeId,
        createdAt: new Date().toISOString(),
      };

      setLeaderboardEntries((prev) => capLeaderboard([newEntry, ...prev]));
      return;
    }

    if (!winnerPlayer) return;

    const entryId = `solo_${selectedGameModeId}_${winnerPlayer.id}_${winnerPlayer.score}`;

    const alreadyExists = leaderboardEntries.some(
      (entry) => entry.id === entryId,
    );
    if (alreadyExists) return;

    const newEntry: LeaderboardEntry = {
      id: entryId,
      type: "solo",
      playerProfileId: winnerPlayer.profileId,
      teamName: winnerPlayer.profileId ? undefined : winnerPlayer.name,
      score: winnerPlayer.score,
      wins: 1,
      gameModeId: selectedGameModeId,
      createdAt: new Date().toISOString(),
    };

    setLeaderboardEntries((prev) => capLeaderboard([newEntry, ...prev]));
  }, [
    isTeamMatch,
    winnerPlayer,
    winnerTeam,
    selectedGameModeId,
    leaderboardEntries,
    setLeaderboardEntries,
  ]);

  // =========================
  // EMPTY STATES
  // =========================

  if (isTeamMatch && !winnerTeam) {
    return (
      <ScreenContainer>
        <Text style={sharedStyles.title}>Winner</Text>
        <Text style={sharedStyles.subtitle}>
          No finished team game data found.
        </Text>

        <Pressable
          style={sharedStyles.primaryButton}
          onPress={handleBackToMenu}
        >
          <Text style={sharedStyles.primaryButtonText}>Back to Menu</Text>
        </Pressable>
      </ScreenContainer>
    );
  }

  if (!isTeamMatch && !winnerPlayer) {
    return (
      <ScreenContainer>
        <Text style={sharedStyles.title}>Winner</Text>
        <Text style={sharedStyles.subtitle}>No finished game data found.</Text>

        <Pressable
          style={sharedStyles.primaryButton}
          onPress={handleBackToMenu}
        >
          <Text style={sharedStyles.primaryButtonText}>Back to Menu</Text>
        </Pressable>
      </ScreenContainer>
    );
  }

  // =========================
  // TEAM VIEW
  // =========================

  if (isTeamMatch && winnerTeam) {
    return (
      <ScreenContainer>
        <Text style={sharedStyles.title}>Winner</Text>
        <Text style={sharedStyles.subtitle}>
          The game is over. Here are the team results.
        </Text>

        <View style={styles.winnerCard}>
          <Text style={styles.winnerLabel}>Winning Team</Text>
          <Text style={styles.winnerName}>{winnerTeam.team.toUpperCase()}</Text>
          <Text style={styles.winnerScore}>{winnerTeam.score} points</Text>
        </View>

        <View style={styles.scoreboardSection}>
          <Text style={sharedStyles.sectionTitle}>Team Scoreboard</Text>

          <FlatList
            data={teamResults}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <View style={styles.scoreRow}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankBadgeText}>{index + 1}</Text>
                </View>

                <View style={styles.playerInfo}>
                  <Text style={styles.playerName}>
                    {item.team.toUpperCase()}
                  </Text>
                  <Text style={styles.playerMeta}>
                    {item.members.join(", ")}
                  </Text>
                </View>

                <Text style={styles.playerScore}>{item.score}</Text>
              </View>
            )}
            contentContainerStyle={styles.scoreboardList}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <View style={sharedStyles.bottomActions}>
          <Pressable
            style={sharedStyles.secondaryButton}
            onPress={handleBackToMenu}
          >
            <Text style={sharedStyles.secondaryButtonText}>Menu</Text>
          </Pressable>

          <Pressable
            style={sharedStyles.primaryButton}
            onPress={handleGoToLeaderboard}
          >
            <Text style={sharedStyles.primaryButtonText}>Leaderboard</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  // =========================
  // SOLO VIEW
  // =========================

  return (
    <ScreenContainer>
      <Text style={sharedStyles.title}>Winner</Text>
      <Text style={sharedStyles.subtitle}>
        The game is over. Here are the final results.
      </Text>

      <View style={styles.winnerCard}>
        <Text style={styles.winnerLabel}>Winner</Text>
        <Text style={styles.winnerName}>{winnerPlayer!.name}</Text>
        <Text style={styles.winnerScore}>{winnerPlayer!.score} points</Text>
      </View>

      <View style={styles.scoreboardSection}>
        <Text style={sharedStyles.sectionTitle}>Final Scoreboard</Text>

        <FlatList
          data={sortedPlayers}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={styles.scoreRow}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankBadgeText}>{index + 1}</Text>
              </View>

              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{item.name}</Text>
                <Text style={styles.playerMeta}>
                  {item.profileId ? "Existing profile" : "Guest player"}
                </Text>
              </View>

              <Text style={styles.playerScore}>{item.score}</Text>
            </View>
          )}
          contentContainerStyle={styles.scoreboardList}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <View style={sharedStyles.bottomActions}>
        <Pressable
          style={sharedStyles.secondaryButton}
          onPress={handleBackToMenu}
        >
          <Text style={sharedStyles.secondaryButtonText}>Menu</Text>
        </Pressable>

        <Pressable
          style={sharedStyles.primaryButton}
          onPress={handleGoToLeaderboard}
        >
          <Text style={sharedStyles.primaryButtonText}>Leaderboard</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  winnerCard: {
    width: "100%",
    backgroundColor: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.purple,
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
  },

  winnerLabel: {
    color: "#9ca3af",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6,
    textTransform: "uppercase",
  },

  winnerName: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 6,
  },

  winnerScore: {
    color: COLORS.purple,
    fontSize: 18,
    fontWeight: "800",
  },

  scoreboardSection: {
    flex: 1,
    width: "100%",
  },

  scoreboardList: {
    gap: 10,
    paddingBottom: 12,
  },

  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.purple,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 12,
  },

  rankBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.purple,
    alignItems: "center",
    justifyContent: "center",
  },

  rankBadgeText: {
    color: "#ffffff",
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
    color: "#9ca3af",
    fontSize: 13,
  },

  playerScore: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "900",
  },
});
