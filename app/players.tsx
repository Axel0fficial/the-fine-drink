import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import ScreenContainer from "../src/components/ScreenContainer";
import { useGameStore } from "../src/state/gameStore";
import type {
  GamePlayer,
  PlayerProfile,
  PlayerTag,
  TeamColor,
} from "../src/types/game";

const TEAM_ORDER: TeamColor[] = ["none", "red", "blue", "green", "yellow"];

const TEAM_COLORS: Record<TeamColor, string> = {
  none: "#3a3a3a",
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#22c55e",
  yellow: "#eab308",
};

const PLAYER_TAG_OPTIONS: { value: PlayerTag; label: string }[] = [
  { value: "none", label: "No Tag" },
  { value: "non_drinker", label: "Non-drinker" },
];

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
    tag: profile.tag,
  };
}

function createPlayerProfile(name: string): PlayerProfile {
  return {
    id: `player_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name,
    totalPoints: 0,
    totalWins: 0,
    tag: "none",
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

function formatTag(tag: PlayerTag) {
  switch (tag) {
    case "non_drinker":
      return "Non-drinker";
    case "none":
    default:
      return "No tag";
  }
}

export default function PlayerScreen() {
  const [playerName, setPlayerName] = useState("");
  const [existingPlayersModalVisible, setExistingPlayersModalVisible] =
    useState(false);
  const [editingProfile, setEditingProfile] = useState<PlayerProfile | null>(
    null,
  );
  const [editName, setEditName] = useState("");
  const [editTag, setEditTag] = useState<PlayerTag>("none");

  const {
    selectedPlayers,
    setSelectedPlayers,
    playerProfiles,
    setPlayerProfiles,
  } = useGameStore();

  const [players, setPlayers] = useState<GamePlayer[]>(selectedPlayers);

  useEffect(() => {
    setPlayers(selectedPlayers);
  }, [selectedPlayers]);

  const [teamModeEnabled, setTeamModeEnabled] = useState(
    selectedPlayers.some((player) => player.team !== "none"),
  );

  useEffect(() => {
    setTeamModeEnabled(players.some((player) => player.team !== "none"));
  }, [players]);

  const canContinue = players.length >= 2;

  const existingPlayerIdsInMatch = useMemo(() => {
    return new Set(players.map((player) => player.profileId).filter(Boolean));
  }, [players]);

  const sortedProfiles = useMemo(() => {
    return [...playerProfiles].sort((a, b) => a.name.localeCompare(b.name));
  }, [playerProfiles]);

  const handleToggleTeams = () => {
    setTeamModeEnabled((prev) => {
      const nextValue = !prev;

      if (!nextValue) {
        setPlayers((currentPlayers) =>
          currentPlayers.map((player) => ({
            ...player,
            team: "none",
          })),
        );
      }

      return nextValue;
    });
  };

  const addPlayerByName = () => {
    const cleanName = normalizeName(playerName);

    if (!cleanName) return;

    const alreadyInMatch = players.some(
      (player) => player.name.toLowerCase() === cleanName.toLowerCase(),
    );

    if (alreadyInMatch) return;

    const existingProfile = playerProfiles.find(
      (profile) => profile.name.toLowerCase() === cleanName.toLowerCase(),
    );

    if (existingProfile) {
      setPlayers((prev) => [
        ...prev,
        createGamePlayerFromProfile(existingProfile),
      ]);
    } else {
      const newProfile = createPlayerProfile(cleanName);

      setPlayerProfiles((prev) => [...prev, newProfile]);
      setPlayers((prev) => [...prev, createGamePlayerFromProfile(newProfile)]);
    }

    setPlayerName("");
  };

  const addExistingPlayer = (profile: PlayerProfile) => {
    const alreadyInMatch = players.some(
      (player) => player.profileId === profile.id,
    );

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
          : player,
      ),
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

  const openEditProfile = (profile: PlayerProfile) => {
    setEditingProfile(profile);
    setEditName(profile.name);
    setEditTag(profile.tag);
  };

  const closeEditProfile = () => {
    setEditingProfile(null);
    setEditName("");
    setEditTag("none");
  };

  const saveEditedProfile = () => {
    if (!editingProfile) return;

    const cleanName = normalizeName(editName);
    if (!cleanName) return;

    const duplicateProfile = playerProfiles.find(
      (profile) =>
        profile.id !== editingProfile.id &&
        profile.name.toLowerCase() === cleanName.toLowerCase(),
    );

    if (duplicateProfile) return;

    setPlayerProfiles((prev) =>
      prev.map((profile) =>
        profile.id === editingProfile.id
          ? {
              ...profile,
              name: cleanName,
              tag: editTag,
            }
          : profile,
      ),
    );

    setPlayers((prev) =>
      prev.map((player) =>
        player.profileId === editingProfile.id
          ? {
              ...player,
              name: cleanName,
              tag: editTag,
            }
          : player,
      ),
    );

    closeEditProfile();
  };

  const deleteEditedProfile = () => {
    if (!editingProfile) return;

    setPlayerProfiles((prev) =>
      prev.filter((profile) => profile.id !== editingProfile.id),
    );

    closeEditProfile();
  };

  const renderProfileCard = ({ item }: { item: PlayerProfile }) => {
  const alreadyInMatch = existingPlayerIdsInMatch.has(item.id);

  return (
    <Pressable
      style={[
        styles.existingPlayerCard,
        alreadyInMatch && styles.existingPlayerCardDisabled,
      ]}
      onPress={() => {
        if (!alreadyInMatch) addExistingPlayer(item);
      }}
      disabled={alreadyInMatch}
    >
      <View style={styles.existingPlayerCardTopRow}>
        <View style={styles.existingPlayerCardTextWrap}>
          <Text style={styles.existingPlayerName}>{item.name}</Text>
        </View>

        <Pressable
          style={styles.profileEditButton}
          onPress={() => openEditProfile(item)}
        >
          <Text style={styles.profileEditButtonText}>Edit</Text>
        </Pressable>
      </View>
    </Pressable>
  );
};
  const renderPlayerRow = ({
    item,
    index,
  }: {
    item: GamePlayer;
    index: number;
  }) => {
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
            {item.profileId ? "Existing profile" : "New player"} •{" "}
            {formatTag(item.tag)}
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
    <ScreenContainer>
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
          onPress={handleToggleTeams}
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
              Add new players with the input or recover existing ones from the
              modal.
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
        <Pressable
          style={styles.secondaryButton}
          onPress={assignRandomTeamsEvenly}
        >
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

      <Modal
        visible={existingPlayersModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setExistingPlayersModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Player Profiles</Text>
              <Pressable onPress={() => setExistingPlayersModalVisible(false)}>
                <Text style={styles.modalCloseText}>Close</Text>
              </Pressable>
            </View>

            {sortedProfiles.length === 0 ? (
              <View style={styles.modalEmptyState}>
                <Text style={styles.modalEmptyTitle}>No profiles</Text>
                <Text style={styles.modalEmptyText}>
                  Create a player with the input to start building reusable
                  profiles.
                </Text>
              </View>
            ) : (
              <FlatList
                data={sortedProfiles}
                keyExtractor={(item) => item.id}
                renderItem={renderProfileCard}
                numColumns={2}
                columnWrapperStyle={styles.modalGridRow}
                contentContainerStyle={styles.modalGridContent}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </Modal>

      <Modal
        visible={!!editingProfile}
        animationType="slide"
        transparent
        onRequestClose={closeEditProfile}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.editModalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <Pressable onPress={closeEditProfile}>
                <Text style={styles.modalCloseText}>Close</Text>
              </Pressable>
            </View>
            {editingProfile && (
  <View style={styles.profileSummaryCard}>
    <Text style={styles.profileSummaryTitle}>Profile Info</Text>
    <Text style={styles.profileSummaryText}>
      Wins: {editingProfile.totalWins}
    </Text>
    <Text style={styles.profileSummaryText}>
      Points: {editingProfile.totalPoints}
    </Text>
    <Text style={styles.profileSummaryText}>
      Current Tag: {formatTag(editingProfile.tag)}
    </Text>
  </View>
)}

            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              value={editName}
              onChangeText={setEditName}
              placeholder="Player name"
              placeholderTextColor="#8b8b8b"
              style={styles.editInput}
            />

            <Text style={styles.inputLabel}>Tag</Text>
            <View style={styles.tagRow}>
              {PLAYER_TAG_OPTIONS.map((option) => {
                const selected = editTag === option.value;

                return (
                  <Pressable
                    key={option.value}
                    style={[
                      styles.tagButton,
                      selected && styles.tagButtonActive,
                    ]}
                    onPress={() => setEditTag(option.value)}
                  >
                    <Text style={styles.tagButtonText}>{option.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.editActions}>
              <Pressable
                style={[styles.editActionButton, styles.deleteProfileButton]}
                onPress={deleteEditedProfile}
              >
                <Text style={styles.deleteProfileButtonText}>Delete</Text>
              </Pressable>

              <Pressable
                style={[styles.editActionButton, styles.saveProfileButton]}
                onPress={saveEditedProfile}
              >
                <Text style={styles.saveProfileButtonText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  editModalCard: {
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
  profileCardActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },
  profileCardButton: {
    flex: 1,
    backgroundColor: "#2b2b2b",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  profileCardButtonDisabled: {
    opacity: 0.5,
  },
  profileCardButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "800",
  },
  profileCardButtonTextDisabled: {
    color: "#d3cbe9",
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
  inputLabel: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },
  editInput: {
    backgroundColor: "#1b1b1b",
    borderWidth: 1,
    borderColor: "#313131",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 16,
  },
  tagRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  tagButton: {
    flex: 1,
    backgroundColor: "#202020",
    borderWidth: 1,
    borderColor: "#313131",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  tagButtonActive: {
    backgroundColor: "#2b2144",
    borderColor: "#8b5cf6",
  },
  tagButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  editActions: {
    flexDirection: "row",
    gap: 12,
  },
  editActionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteProfileButton: {
    backgroundColor: "#2a1616",
    borderWidth: 1,
    borderColor: "#7f1d1d",
  },
  deleteProfileButtonText: {
    color: "#f0b4b4",
    fontWeight: "800",
    fontSize: 15,
  },
  saveProfileButton: {
    backgroundColor: "#8b5cf6",
  },
  saveProfileButtonText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 15,
  },
  existingPlayerCardDisabled: {
  opacity: 0.55,
},

existingPlayerCardTopRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
},

existingPlayerCardTextWrap: {
  flex: 1,
},

existingPlayerHint: {
  marginTop: 4,
  fontSize: 13,
  color: "#9ca3af",
},

profileEditButton: {
  backgroundColor: "#2b2b2b",
  borderWidth: 1,
  borderColor: "#3a3a3a",
  paddingVertical: 10,
  paddingHorizontal: 14,
  borderRadius: 12,
},

profileEditButtonText: {
  color: "#ffffff",
  fontSize: 14,
  fontWeight: "700",
},

profileSummaryCard: {
  backgroundColor: "#1b1b1b",
  borderWidth: 1,
  borderColor: "#313131",
  borderRadius: 14,
  padding: 14,
  marginBottom: 16,
},

profileSummaryTitle: {
  color: "#ffffff",
  fontSize: 15,
  fontWeight: "800",
  marginBottom: 10,
},

profileSummaryText: {
  color: "#d1d5db",
  fontSize: 14,
  lineHeight: 20,
  marginBottom: 4,
},
});