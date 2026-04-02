import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  Modal,
  SafeAreaView,
  Alert,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { GamePlayer, PlayerProfile, TeamColor } from "../src/types/game";
import { mockPlayers } from "../src/data/mockPlayers";
import { useGameStore } from "../src/state/gameStore";

const STORAGE_KEYS = {
  selectedPlayers: "thefinedrink:selectedPlayers",
};

const TEAM_ORDER: TeamColor[] = ["none", "red", "blue", "green", "yellow"];

const TEAM_COLORS: Record<TeamColor, string> = {
  none: "#3a3a3a",
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#22c55e",
  yellow: "#eab308",
};

function normalizeName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function createGamePlayerFromProfile(profile: PlayerProfile): GamePlayer {
  return {
    id: `gp_${profile.id}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    profileId: profile.id,
    name: profile.name,
    score: 0,
    team: "none",
  };
}

function createNewGamePlayer(name: string): GamePlayer {
  return {
    id: `gp_new_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name,
    score: 0,
    team: "none",
  };
}

function getNextTeam(current: TeamColor): TeamColor {
  const currentIndex = TEAM_ORDER.indexOf(current);
  const nextIndex = (currentIndex + 1) % TEAM_ORDER.length;
  return TEAM_ORDER[nextIndex];
}

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function PlayerScreen() {
  const [playerName, setPlayerName] = useState("");
  const [players, setPlayers] = useState<GamePlayer[]>([]);
  const [existingPlayersModalVisible, setExistingPlayersModalVisible] = useState(false);
  const [teamModeEnabled, setTeamModeEnabled] = useState(false);
  const [isLoadingSavedPlayers, setIsLoadingSavedPlayers] = useState(true);
  const { setSelectedPlayers } = useGameStore();

  const canContinue = players.length >= 2;

  useEffect(() => {
    loadSavedPlayers();
  }, []);

  useEffect(() => {
    if (!isLoadingSavedPlayers) {
      saveSelectedPlayers(players);
    }
  }, [players, isLoadingSavedPlayers]);

  async function loadSavedPlayers() {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.selectedPlayers);

      if (raw) {
        const parsed = JSON.parse(raw) as GamePlayer[];

        if (Array.isArray(parsed)) {
          setPlayers(parsed);
        }
      }
    } catch (error) {
      console.error("Failed to load saved players:", error);
    } finally {
      setIsLoadingSavedPlayers(false);
    }
  }

  async function saveSelectedPlayers(nextPlayers: GamePlayer[]) {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.selectedPlayers,
        JSON.stringify(nextPlayers)
      );
    } catch (error) {
      console.error("Failed to save selected players:", error);
    }
  }

  const existingPlayerIdsInMatch = useMemo(() => {
    return new Set(players.map((player) => player.profileId).filter(Boolean));
  }, [players]);

  const availableExistingPlayers = useMemo(() => {
    return mockPlayers.filter(
      (profile) => !existingPlayerIdsInMatch.has(profile.id)
    );
  }, [existingPlayerIdsInMatch]);

  const addPlayerByName = () => {
    const cleanName = normalizeName(playerName);

    if (!cleanName) return;

    const alreadyInMatch = players.some(
      (player) => player.name.toLowerCase() === cleanName.toLowerCase()
    );

    if (alreadyInMatch) {
      Alert.alert("Player already added", `"${cleanName}" is already in this match.`);
      return;
    }

    const existingProfile = mockPlayers.find(
      (profile) => profile.name.toLowerCase() === cleanName.toLowerCase()
    );

    if (existingProfile) {
      setPlayers((prev) => [...prev, createGamePlayerFromProfile(existingProfile)]);
    } else {
      setPlayers((prev) => [...prev, createNewGamePlayer(cleanName)]);
    }

    setPlayerName("");
  };

  const addExistingPlayer = (profile: PlayerProfile) => {
    const alreadyInMatch = players.some((player) => player.profileId === profile.id);

    if (alreadyInMatch) return;

    setPlayers((prev) => [...prev, createGamePlayerFromProfile(profile)]);
  };

  const removePlayer = (playerId: string) => {
    setPlayers((prev) => prev.filter((player) => player.id !== playerId));
  };

  const cyclePlayerTeam = (playerId: string) => {
    setPlayers((prev) =>
      prev.map((player) =>
        player.id === playerId
          ? { ...player, team: getNextTeam(player.team) }
          : player
      )
    );
  };

  const assignRandomTeamsEvenly = () => {
    if (players.length === 0) return;

    const teamCount = Math.min(4, players.length);
    const activeTeams = TEAM_ORDER.slice(1, teamCount + 1) as TeamColor[];

    const shuffledPlayers = shuffleArray(players);
    const redistributed = shuffledPlayers.map((player, index) => ({
      ...player,
      team: activeTeams[index % activeTeams.length],
    }));

    setPlayers(redistributed);
    setTeamModeEnabled(true);
  };

  const continueToMenu = () => {
    if (!canContinue) return;

    setSelectedPlayers(players);
    router.push("/menu");
  };

  const renderExistingPlayerCard = ({ item }: { item: PlayerProfile }) => {
    return (
      <Pressable
        style={styles.existingPlayerCard}
        onPress={() => addExistingPlayer(item)}
      >
        <Text style={styles.existingPlayerName}>{item.name}</Text>
        <Text style={styles.existingPlayerMeta}>Wins: {item.totalWins}</Text>
        <Text style={styles.existingPlayerMeta}>Points: {item.totalPoints}</Text>
      </Pressable>
    );
  };

  const renderPlayerRow = ({ item, index }: { item: GamePlayer; index: number }) => {
    return (
      <View style={styles.playerRow}>
        <Pressable
          style={[
            styles.teamBox,
            { backgroundColor: TEAM_COLORS[item.team] },
            !teamModeEnabled && styles.teamBoxDisabled,
          ]}
          onPress={() => {
            if (teamModeEnabled) cyclePlayerTeam(item.id);
          }}
        >
          <Text style={styles.teamBoxText}>
            {item.team === "none" ? "-" : item.team[0].toUpperCase()}
          </Text>
        </Pressable>

        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>
            {index + 1}. {item.name}
          </Text>
          <Text style={styles.playerSubtext}>
            {item.profileId ? "Existing profile" : "New player"}
          </Text>
        </View>

        <Pressable
          style={styles.removeButton}
          onPress={() => removePlayer(item.id)}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Players</Text>
        <Text style={styles.subtitle}>
          Add players, recover old profiles, and organize teams.
        </Text>

        <View style={styles.topNav}>
          <Pressable
            style={styles.topNavButton}
            onPress={() => setExistingPlayersModalVisible(true)}
          >
            <Text style={styles.topNavButtonText}>Add Existing Players</Text>
          </Pressable>

          <Pressable
            style={[
              styles.topNavButton,
              teamModeEnabled && styles.topNavButtonActive,
            ]}
            onPress={() => setTeamModeEnabled((prev) => !prev)}
          >
            <Text style={styles.topNavButtonText}>
              {teamModeEnabled ? "Teams: On" : "Teams"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.inputRow}>
          <TextInput
            value={playerName}
            onChangeText={setPlayerName}
            placeholder="Write a player name"
            placeholderTextColor="#8b8b8b"
            style={styles.input}
            onSubmitEditing={addPlayerByName}
            returnKeyType="done"
          />

          <Pressable style={styles.addButton} onPress={addPlayerByName}>
            <Text style={styles.addButtonText}>Add</Text>
          </Pressable>
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Current Players</Text>
          <Text style={styles.playerCount}>{players.length} added</Text>
        </View>

        <View style={styles.playersListWrapper}>
          {players.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No players yet</Text>
              <Text style={styles.emptyStateText}>
                Add new players with the input or recover existing ones from the modal.
              </Text>
            </View>
          ) : (
            <FlatList
              data={players}
              keyExtractor={(item) => item.id}
              renderItem={renderPlayerRow}
              contentContainerStyle={styles.playersListContent}
            />
          )}
        </View>

        <View style={styles.bottomActions}>
          <Pressable style={styles.secondaryButton} onPress={assignRandomTeamsEvenly}>
            <Text style={styles.secondaryButtonText}>Random Teams</Text>
          </Pressable>

          <Pressable
            style={[
              styles.primaryButton,
              !canContinue && styles.primaryButtonDisabled,
            ]}
            onPress={continueToMenu}
            disabled={!canContinue}
          >
            <Text
              style={[
                styles.primaryButtonText,
                !canContinue && styles.primaryButtonTextDisabled,
              ]}
            >
              Continue
            </Text>
          </Pressable>
        </View>
      </View>

      <Modal
        visible={existingPlayersModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setExistingPlayersModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Existing Players</Text>
              <Pressable onPress={() => setExistingPlayersModalVisible(false)}>
                <Text style={styles.modalCloseText}>Close</Text>
              </Pressable>
            </View>

            {availableExistingPlayers.length === 0 ? (
              <View style={styles.modalEmptyState}>
                <Text style={styles.modalEmptyTitle}>No available profiles</Text>
                <Text style={styles.modalEmptyText}>
                  All saved players are already in the current match.
                </Text>
              </View>
            ) : (
              <FlatList
                data={availableExistingPlayers}
                keyExtractor={(item) => item.id}
                renderItem={renderExistingPlayerCard}
                numColumns={2}
                columnWrapperStyle={styles.modalGridRow}
                contentContainerStyle={styles.modalGridContent}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#111111",
  },
  container: {
    flex: 1,
    backgroundColor: "#111111",
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 22,
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
  topNav: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
    marginBottom: 16,
  },
  topNavButton: {
    flex: 1,
    backgroundColor: "#1f1f1f",
    borderWidth: 1,
    borderColor: "#333333",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  topNavButtonActive: {
    borderColor: "#8b5cf6",
    backgroundColor: "#2b2144",
  },
  topNavButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  inputRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 18,
  },
  input: {
    flex: 1,
    backgroundColor: "#1b1b1b",
    borderWidth: 1,
    borderColor: "#313131",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: "#ffffff",
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#8b5cf6",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 82,
  },
  addButtonText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 15,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#ffffff",
  },
  playerCount: {
    fontSize: 13,
    color: "#aaaaaa",
  },
  playersListWrapper: {
    flex: 1,
    backgroundColor: "#171717",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    padding: 10,
  },
  playersListContent: {
    paddingBottom: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#aaaaaa",
    textAlign: "center",
    lineHeight: 20,
  },
  playerRow: {
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
  teamBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  teamBoxDisabled: {
    opacity: 0.45,
  },
  teamBoxText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "800",
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  playerSubtext: {
    marginTop: 3,
    color: "#aaaaaa",
    fontSize: 12,
  },
  removeButton: {
    marginLeft: 12,
    backgroundColor: "#2a2a2a",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  removeButtonText: {
    color: "#f1f1f1",
    fontWeight: "700",
    fontSize: 13,
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
  primaryButtonDisabled: {
    backgroundColor: "#3b3159",
    opacity: 0.5,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 15,
  },
  primaryButtonTextDisabled: {
    color: "#d3cbe9",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.72)",
    justifyContent: "center",
    padding: 18,
  },
  modalCard: {
    maxHeight: "80%",
    backgroundColor: "#151515",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#303030",
    padding: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  modalTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
  },
  modalCloseText: {
    color: "#8b5cf6",
    fontSize: 15,
    fontWeight: "700",
  },
  modalGridContent: {
    paddingBottom: 8,
  },
  modalGridRow: {
    gap: 12,
    marginBottom: 12,
  },
  existingPlayerCard: {
    flex: 1,
    backgroundColor: "#202020",
    borderWidth: 1,
    borderColor: "#313131",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 14,
    minHeight: 100,
    justifyContent: "center",
  },
  existingPlayerName: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 6,
  },
  existingPlayerMeta: {
    color: "#b3b3b3",
    fontSize: 13,
    marginTop: 2,
  },
  modalEmptyState: {
    paddingVertical: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  modalEmptyTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
  },
  modalEmptyText: {
    color: "#aaaaaa",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});