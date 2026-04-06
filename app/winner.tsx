import { router } from "expo-router";
import React, { useEffect, useMemo } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

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

  if (isTeamMatch) {
    if (!winnerTeam) {
      return (
        <ScreenContainer>
          <Text style={styles.title}>Winner</Text>
          <Text style={styles.emptyText}>
            No finished team game data found.
          </Text>

          <Pressable style={styles.primaryButton} onPress={handleBackToMenu}>
            <Text style={styles.primaryButtonText}>Back to Menu</Text>
          </Pressable>
        </ScreenContainer>
      );
    }

    return (
      <ScreenContainer>
        <Text style={styles.title}>Winner</Text>
        <Text style={styles.subtitle}>
          The game is over. Here are the team results.
        </Text>

        <View style={styles.winnerCard}>
          <Text style={styles.winnerLabel}>Winning Team</Text>
          <Text style={styles.winnerName}>{winnerTeam.team.toUpperCase()}</Text>
          <Text style={styles.winnerScore}>{winnerTeam.score} points</Text>
        </View>

        <View style={styles.scoreboardSection}>
          <Text style={styles.sectionTitle}>Team Scoreboard</Text>

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

        <View style={styles.bottomActions}>
          <Pressable style={styles.secondaryButton} onPress={handleBackToMenu}>
            <Text style={styles.secondaryButtonText}>Menu</Text>
          </Pressable>

          <Pressable
            style={styles.primaryButton}
            onPress={handleGoToLeaderboard}
          >
            <Text style={styles.primaryButtonText}>Leaderboard</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  if (!winnerPlayer) {
    return (
      <ScreenContainer>
        <Text style={styles.title}>Winner</Text>
        <Text style={styles.emptyText}>No finished game data found.</Text>

        <Pressable style={styles.primaryButton} onPress={handleBackToMenu}>
          <Text style={styles.primaryButtonText}>Back to Menu</Text>
        </Pressable>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>Winner</Text>
      <Text style={styles.subtitle}>
        The game is over. Here are the final results.
      </Text>

      <View style={styles.winnerCard}>
        <Text style={styles.winnerLabel}>Winner</Text>
        <Text style={styles.winnerName}>{winnerPlayer.name}</Text>
        <Text style={styles.winnerScore}>{winnerPlayer.score} points</Text>
      </View>

      <View style={styles.scoreboardSection}>
        <Text style={styles.sectionTitle}>Final Scoreboard</Text>

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

      <View style={styles.bottomActions}>
        <Pressable style={styles.secondaryButton} onPress={handleBackToMenu}>
          <Text style={styles.secondaryButtonText}>Menu</Text>
        </Pressable>

        <Pressable style={styles.primaryButton} onPress={handleGoToLeaderboard}>
          <Text style={styles.primaryButtonText}>Leaderboard</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    color: "#b5b5b5",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  emptyText: {
    color: "#b5b5b5",
    fontSize: 15,
    marginBottom: 20,
  },
  winnerCard: {
    width: "100%",
    backgroundColor: "#1d1d1d",
    borderWidth: 1,
    borderColor: "#313131",
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
    color: "#8b5cf6",
    fontSize: 18,
    fontWeight: "800",
  },
  scoreboardSection: {
    flex: 1,
    width: "100%",
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 14,
  },
  scoreboardList: {
    gap: 10,
    paddingBottom: 12,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#181818",
    borderWidth: 1,
    borderColor: "#2d2d2d",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 12,
  },
  rankBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#8b5cf6",
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
  bottomActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
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
});
