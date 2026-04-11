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

import { COLORS, sharedStyles } from "../app/sharedStyles";
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
  none: "#1a1a1a",
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
        <View style={styles.existingPlayerCardContent}>
          <Text style={styles.existingPlayerName}>{item.name}</Text>

          <View style={styles.existingPlayerCardActions}>
            <Pressable
              style={sharedStyles.smallActionButton}
              onPress={() => openEditProfile(item)}
            >
              <Text style={sharedStyles.smallActionButtonText}>Edit</Text>
            </Pressable>
          </View>
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
          style={sharedStyles.smallActionButton}
          onPress={() => removePlayer(item.id)}
        >
          <Text style={sharedStyles.smallActionButtonText}>Remove</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <ScreenContainer>
      <Text style={sharedStyles.title}>Players</Text>
      <Text style={sharedStyles.subtitle}>
        Add players, recover old profiles, and organize teams.
      </Text>

      <View style={sharedStyles.topNav}>
        <Pressable
          style={sharedStyles.topNavButton}
          onPress={() => setExistingPlayersModalVisible(true)}
        >
          <Text style={sharedStyles.topNavButtonText}>
            Add Existing Players
          </Text>
        </Pressable>

        <Pressable
          style={[
            sharedStyles.topNavButton,
            teamModeEnabled && sharedStyles.topNavButtonActive,
          ]}
          onPress={handleToggleTeams}
        >
          <Text style={sharedStyles.topNavButtonText}>
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
          style={[sharedStyles.input, styles.inputFlex]}
          onSubmitEditing={addPlayerByName}
          returnKeyType="done"
        />

        <Pressable style={styles.addButton} onPress={addPlayerByName}>
          <Text style={sharedStyles.primaryButtonText}>Add</Text>
        </Pressable>
      </View>

      <View style={styles.playersListWrapper}>
        {players.length === 0 ? (
          <View style={sharedStyles.emptyState}>
            <Text style={sharedStyles.emptyStateTitle}>No players yet</Text>
            <Text style={sharedStyles.emptyStateText}>
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

      <View style={sharedStyles.bottomActions}>
        <Pressable
          style={[sharedStyles.secondaryButton, styles.actionButtonFlex]}
          onPress={assignRandomTeamsEvenly}
        >
          <Text style={sharedStyles.secondaryButtonText}>Random Teams</Text>
        </Pressable>

        <Pressable
          style={[
            sharedStyles.primaryButton,
            styles.actionButtonFlex,
            !canContinue && sharedStyles.primaryButtonDisabled,
          ]}
          onPress={continueToMenu}
          disabled={!canContinue}
        >
          <Text
            style={[
              sharedStyles.primaryButtonText,
              !canContinue && sharedStyles.primaryButtonTextDisabled,
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
        <View style={sharedStyles.modalBackdrop}>
          <View style={sharedStyles.modalCard}>
            <View style={sharedStyles.modalHeader}>
              <Text style={sharedStyles.modalTitle}>Player Profiles</Text>
              <Pressable onPress={() => setExistingPlayersModalVisible(false)}>
                <Text style={sharedStyles.modalCloseText}>Close</Text>
              </Pressable>
            </View>

            {sortedProfiles.length === 0 ? (
              <View style={styles.modalEmptyState}>
                <Text style={sharedStyles.emptyStateTitle}>No profiles</Text>
                <Text style={sharedStyles.emptyStateText}>
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
        <View style={sharedStyles.modalBackdrop}>
          <View style={styles.editModalCard}>
            <View style={sharedStyles.modalHeader}>
              <Text style={sharedStyles.modalTitle}>Edit Profile</Text>
              <Pressable onPress={closeEditProfile}>
                <Text style={sharedStyles.modalCloseText}>Close</Text>
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

            <Text style={sharedStyles.inputLabel}>Name</Text>
            <TextInput
              value={editName}
              onChangeText={setEditName}
              placeholder="Player name"
              placeholderTextColor="#8b8b8b"
              style={sharedStyles.input}
            />

            <Text style={[sharedStyles.inputLabel, styles.tagLabel]}>Tag</Text>
            <View style={styles.tagRow}>
              {PLAYER_TAG_OPTIONS.map((option) => {
                const selected = editTag === option.value;

                return (
                  <Pressable
                    key={option.value}
                    style={[
                      sharedStyles.chip,
                      styles.tagButton,
                      selected && sharedStyles.chipActive,
                    ]}
                    onPress={() => setEditTag(option.value)}
                  >
                    <Text style={sharedStyles.chipText}>{option.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.editActions}>
              <Pressable
                style={[sharedStyles.dangerButton, styles.actionButtonFlex]}
                onPress={deleteEditedProfile}
              >
                <Text style={sharedStyles.dangerButtonText}>Delete</Text>
              </Pressable>

              <Pressable
                style={[sharedStyles.primaryButton, styles.actionButtonFlex]}
                onPress={saveEditedProfile}
              >
                <Text style={sharedStyles.primaryButtonText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 14,
  },

  inputFlex: {
    flex: 1,
  },

  addButton: {
    backgroundColor: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.purple,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 82,
  },

  playersListWrapper: {
    flex: 1,
    backgroundColor: COLORS.black,
    borderRadius: 16,
    borderWidth: 0,
    padding: 10,
    marginTop: 8,
  },

  playersListContent: {
    paddingBottom: 8,
  },

  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.black,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: COLORS.purple,
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

  actionButtonFlex: {
    flex: 1,
  },

  modalEmptyState: {
    paddingVertical: 28,
    alignItems: "center",
    justifyContent: "center",
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
    backgroundColor: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.purple,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 14,
    minHeight: 100,
    justifyContent: "center",
  },

  existingPlayerCardDisabled: {
    opacity: 0.55,
  },

  existingPlayerCardContent: {
    gap: 12,
  },

  existingPlayerCardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  existingPlayerName: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 22,
  },

  editModalCard: {
    backgroundColor: COLORS.black,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.purple,
    padding: 16,
  },

  profileSummaryCard: {
    backgroundColor: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.purple,
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

  tagLabel: {
    marginTop: 16,
  },

  tagRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },

  tagButton: {
    flex: 1,
    borderRadius: 12,
    alignItems: "center",
  },

  editActions: {
    flexDirection: "row",
    gap: 12,
  },
});
