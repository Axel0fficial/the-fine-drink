import { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

import { colors, radius, sharedStyles, spacing } from "@/style/theme";
import { SavedPlayer } from "@/types/game";

type SavedPlayersModalProps = {
  visible: boolean;
  savedPlayers: SavedPlayer[];
  selectedPlayerIds: string[];
  onClose: () => void;
  onToggleSelect: (player: SavedPlayer) => void;
  onUpdatePlayer: (player: SavedPlayer) => void;
  onDeletePlayer: (playerId: string) => void;
};

export default function SavedPlayersModal({
  visible,
  savedPlayers,
  selectedPlayerIds,
  onClose,
  onToggleSelect,
  onUpdatePlayer,
  onDeletePlayer,
}: SavedPlayersModalProps) {
  const [mode, setMode] = useState<"select" | "edit">("select");
  const [editingPlayer, setEditingPlayer] = useState<SavedPlayer | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingNonDrinker, setEditingNonDrinker] = useState(false);

  function startEdit(player: SavedPlayer) {
    setEditingPlayer(player);
    setEditingName(player.name);
    setEditingNonDrinker(player.preferences.nonDrinker);
    setMode("edit");
  }

  function cancelEdit() {
    setEditingPlayer(null);
    setEditingName("");
    setEditingNonDrinker(false);
    setMode("select");
  }

  function handleSaveEdit() {
    if (!editingPlayer) return;

    const cleanName = editingName.trim();
    if (!cleanName) return;

    onUpdatePlayer({
      ...editingPlayer,
      name: cleanName,
      preferences: {
        ...editingPlayer.preferences,
        nonDrinker: editingNonDrinker,
      },
    });

    cancelEdit();
  }

  function handleDelete() {
    if (!editingPlayer) return;

    onDeletePlayer(editingPlayer.id);
    cancelEdit();
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>
            {mode === "select" ? "Saved Players" : "Edit Player"}
          </Text>

          {mode === "select" && (
            <>
              <FlatList
                data={savedPlayers}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>No saved players yet.</Text>
                }
                renderItem={({ item }) => {
                  const selected = selectedPlayerIds.includes(item.id);

                  return (
                    <View style={styles.playerRow}>
                      <Pressable
                        style={[
                          styles.playerButton,
                          selected && styles.selectedPlayer,
                        ]}
                        onPress={() => onToggleSelect(item)}
                      >
                        <Text style={styles.playerName}>
                          {selected ? "✓ " : ""}
                          {item.name}
                        </Text>

                        <Text style={styles.playerPreferenceText}>
                          {item.preferences.nonDrinker
                            ? "Non-drinker"
                            : "Drinker"}
                        </Text>
                      </Pressable>

                      <Pressable
                        style={styles.editSmallButton}
                        onPress={() => startEdit(item)}
                      >
                        <Text style={styles.editSmallText}>Edit</Text>
                      </Pressable>
                    </View>
                  );
                }}
              />

              <View style={styles.actions}>
                <Pressable style={styles.primaryButton} onPress={onClose}>
                  <Text style={sharedStyles.buttonText}>Done</Text>
                </Pressable>
              </View>
            </>
          )}

          {mode === "edit" && (
            <>
              <TextInput
                style={sharedStyles.input}
                placeholder="Player name"
                placeholderTextColor={colors.darkMutedText}
                value={editingName}
                onChangeText={setEditingName}
              />

              <View style={styles.preferenceRow}>
                <View style={styles.preferenceTextBox}>
                  <Text style={styles.preferenceTitle}>Non-drinker</Text>
                  <Text style={styles.preferenceSubtitle}>
                    Avoid drinking challenges for this player.
                  </Text>
                </View>

                <Switch
                  value={editingNonDrinker}
                  onValueChange={setEditingNonDrinker}
                />
              </View>

              <View style={styles.actions}>
                <Pressable style={styles.secondaryButton} onPress={cancelEdit}>
                  <Text style={sharedStyles.buttonText}>Cancel</Text>
                </Pressable>

                <Pressable
                  style={styles.primaryButton}
                  onPress={handleSaveEdit}
                >
                  <Text style={sharedStyles.buttonText}>Save</Text>
                </Pressable>
              </View>

              <Pressable style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.deleteText}>Delete Player</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    padding: spacing.xl,
  },
  modalBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    maxHeight: "85%",
    borderColor: colors.primary,
    borderWidth: 1,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  emptyText: {
    color: colors.mutedText,
    textAlign: "center",
    marginVertical: spacing.xl,
  },
  playerRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  playerButton: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    padding: spacing.lg,
    borderRadius: radius.md,
  },
  selectedPlayer: {
    borderColor: colors.primaryLight,
    borderWidth: 2,
  },
  playerName: {
    color: colors.text,
    fontWeight: "bold",
    fontSize: 16,
  },
  playerPreferenceText: {
    color: colors.mutedText,
    marginTop: 4,
    fontSize: 13,
  },
  editSmallButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    justifyContent: "center",
  },
  editSmallText: {
    color: colors.text,
    fontWeight: "bold",
  },
  preferenceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  preferenceTextBox: {
    flex: 1,
  },
  preferenceTitle: {
    color: colors.text,
    fontWeight: "bold",
    fontSize: 16,
  },
  preferenceSubtitle: {
    color: colors.mutedText,
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: "center",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: "center",
  },
  deleteButton: {
    marginTop: spacing.lg,
    alignItems: "center",
  },
  deleteText: {
    color: "#ff6b6b",
    fontWeight: "bold",
  },
});
