import { router } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors, sharedStyles, spacing } from "../style/theme";

type Player = {
  id: string;
  name: string;
  score: number;
  statuses: [];
};

export default function PlayersScreen() {
  const [name, setName] = useState<string>("");
  const [players, setPlayers] = useState<Player[]>([]);

  function addPlayer() {
    const cleanName = name.trim();

    if (!cleanName) return;

    const newPlayer: Player = {
      id: Date.now().toString(),
      name: cleanName,
      score: 0,
      statuses: [],
    };

    setPlayers((currentPlayers) => [...currentPlayers, newPlayer]);
    setName("");
  }

  function removePlayer(id: string) {
    setPlayers((currentPlayers) =>
      currentPlayers.filter((player) => player.id !== id),
    );
  }

  function continueToMenu() {
    router.push({
      pathname: "/menu",
      params: {
        players: JSON.stringify(players),
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

      <FlatList
        style={styles.list}
        data={players}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Add at least 2 players.</Text>
        }
        renderItem={({ item }) => (
          <Pressable
            style={[sharedStyles.card, styles.playerCard]}
            onPress={() => removePlayer(item.id)}
          >
            <Text style={styles.playerName}>{item.name}</Text>
            <Text style={styles.removeText}>Tap to remove</Text>
          </Pressable>
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
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingTop: 70,
  },
  input: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
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
  playerCard: {
    marginBottom: 10,
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
