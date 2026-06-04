import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import SavedPlayersModal from "@/components/players/SavedPlayersModal";
import { colors, sharedStyles, spacing } from "@/style/theme";
import { Player, SavedPlayer, TeamColor } from "@/types/game";
import {
  loadSavedPlayers,
  saveSavedPlayers,
  savedPlayerToSessionPlayer,
} from "@/utils/playerStorage";

export default function PlayersScreen() {
  const [name, setName] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [savedPlayers, setSavedPlayers] = useState<SavedPlayer[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [savedPlayersLoaded, setSavedPlayersLoaded] = useState(false);
  const teamColors: TeamColor[] = [
    "none",
    "red",
    "blue",
    "green",
    "yellow",
    "purple",
  ];
  const [teamsEnabled, setTeamsEnabled] = useState(false);
  useEffect(() => {
    async function loadPlayers() {
      const loadedPlayers = await loadSavedPlayers();
      setSavedPlayers(loadedPlayers);
      setSavedPlayersLoaded(true);
    }

    loadPlayers();
  }, []);

  useEffect(() => {
    if (!savedPlayersLoaded) return;

    saveSavedPlayers(savedPlayers);
  }, [savedPlayers, savedPlayersLoaded]);

  function savePlayerIfNew(player: Player) {
    setSavedPlayers((current) => {
      const alreadyExists = current.some(
        (savedPlayer) =>
          savedPlayer.name.trim().toLowerCase() ===
          player.name.trim().toLowerCase(),
      );

      if (alreadyExists) return current;

      return [
        ...current,
        {
          id: player.id,
          name: player.name,
          preferences: player.preferences,
        },
      ];
    });
  }
  function toggleTeams() {
    setTeamsEnabled((current) => {
      const nextValue = !current;

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
  }
  function cyclePlayerTeam(playerId: string) {
    if (!teamsEnabled) return;

    setPlayers((currentPlayers) =>
      currentPlayers.map((player) => {
        if (player.id !== playerId) return player;

        const currentIndex = teamColors.indexOf(player.team);
        const nextTeam = teamColors[(currentIndex + 1) % teamColors.length];

        return {
          ...player,
          team: nextTeam,
        };
      }),
    );
  }

  function addPlayer() {
    const cleanName = name.trim();

    if (!cleanName) return;

    const newPlayer: Player = {
      id: Date.now().toString(),
      name: cleanName,
      score: 0,
      statuses: [],
      preferences: {
        nonDrinker: false,
      },
      team: "none",
    };

    setPlayers((currentPlayers) => [...currentPlayers, newPlayer]);
    savePlayerIfNew(newPlayer);
    setName("");
  }

  function removePlayer(id: string) {
    setPlayers((currentPlayers) =>
      currentPlayers.filter((player) => player.id !== id),
    );
  }

  function toggleSavedPlayer(savedPlayer: SavedPlayer) {
    const alreadySelected = players.some(
      (player) => player.id === savedPlayer.id,
    );

    if (alreadySelected) {
      setPlayers((currentPlayers) =>
        currentPlayers.filter((player) => player.id !== savedPlayer.id),
      );
      return;
    }

    setPlayers((currentPlayers) => [
      ...currentPlayers,
      savedPlayerToSessionPlayer(savedPlayer),
    ]);
  }

  function updateSavedPlayer(updatedPlayer: SavedPlayer) {
    setSavedPlayers((currentSavedPlayers) =>
      currentSavedPlayers.map((savedPlayer) =>
        savedPlayer.id === updatedPlayer.id ? updatedPlayer : savedPlayer,
      ),
    );

    setPlayers((currentPlayers) =>
      currentPlayers.map((player) =>
        player.id === updatedPlayer.id
          ? {
              ...player,
              name: updatedPlayer.name,
              preferences: updatedPlayer.preferences,
            }
          : player,
      ),
    );
  }

  function deleteSavedPlayer(playerId: string) {
    setSavedPlayers((currentSavedPlayers) =>
      currentSavedPlayers.filter((savedPlayer) => savedPlayer.id !== playerId),
    );

    setPlayers((currentPlayers) =>
      currentPlayers.filter((player) => player.id !== playerId),
    );
  }

  function continueToMenu() {
    router.push({
      pathname: "/menu",
      params: {
        players: JSON.stringify(players),
        teamsEnabled: JSON.stringify(teamsEnabled),
      },
    });
  }

  return (
    <View style={[sharedStyles.screen, styles.container]}>
      <Text style={sharedStyles.title}>Add Players</Text>

      <TextInput
        style={[sharedStyles.input, styles.input]}
        placeholder="Player name"
        placeholderTextColor={colors.darkMutedText}
        value={name}
        onChangeText={setName}
        onSubmitEditing={addPlayer}
      />

      <Pressable style={sharedStyles.primaryButton} onPress={addPlayer}>
        <Text style={sharedStyles.buttonText}>Add Player</Text>
      </Pressable>

      <Pressable
        style={[sharedStyles.secondaryButton, styles.savedPlayersButton]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={sharedStyles.buttonText}>Saved Players</Text>
      </Pressable>
      <Pressable
        style={[
          sharedStyles.secondaryButton,
          styles.savedPlayersButton,
          teamsEnabled && styles.teamsEnabledButton,
        ]}
        onPress={toggleTeams}
      >
        <Text style={sharedStyles.buttonText}>
          Teams: {teamsEnabled ? "On" : "Off"}
        </Text>
      </Pressable>

      <FlatList
        style={styles.list}
        data={players}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Add at least 2 players.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.playerRow}>
            {teamsEnabled && (
              <Pressable
                style={[styles.teamBox, styles[`team_${item.team}`]]}
                onPress={() => cyclePlayerTeam(item.id)}
              />
            )}

            <Pressable
              style={[sharedStyles.card, styles.playerCard]}
              onPress={() => removePlayer(item.id)}
            >
              <Text style={styles.playerName}>{item.name}</Text>
              <Text style={styles.removeText}>Tap to remove</Text>
            </Pressable>
          </View>
        )}
      />

      <Pressable
        style={[
          sharedStyles.primaryButton,
          players.length < 2 && styles.disabledButton,
        ]}
        disabled={players.length < 2}
        onPress={continueToMenu}
      >
        <Text style={sharedStyles.buttonText}>Continue</Text>
      </Pressable>

      <SavedPlayersModal
        visible={modalVisible}
        savedPlayers={savedPlayers}
        selectedPlayerIds={players.map((player) => player.id)}
        onClose={() => setModalVisible(false)}
        onToggleSelect={toggleSavedPlayer}
        onUpdatePlayer={updateSavedPlayer}
        onDeletePlayer={deleteSavedPlayer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 70,
  },
  playerRow: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: spacing.sm,
    marginBottom: 10,
  },
  teamBox: {
    width: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  team_none: {
    backgroundColor: colors.surfaceLight,
  },
  team_red: {
    backgroundColor: "#c0392b",
  },
  team_blue: {
    backgroundColor: "#2980b9",
  },
  team_green: {
    backgroundColor: "#27ae60",
  },
  team_yellow: {
    backgroundColor: "#f1c40f",
  },
  team_purple: {
    backgroundColor: "#8e44ad",
  },
  teamsEnabledButton: {
    borderColor: colors.primaryLight,
    borderWidth: 1,
  },
  playerCard: {
    flex: 1,
  },
  input: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  savedPlayersButton: {
    marginTop: spacing.md,
  },
  list: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  emptyText: {
    color: colors.darkMutedText,
    textAlign: "center",
    marginTop: spacing.xl,
  },
  playerName: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  removeText: {
    color: colors.darkMutedText,
    marginTop: 4,
  },
  disabledButton: {
    opacity: 0.4,
  },
});
