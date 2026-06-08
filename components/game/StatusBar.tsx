import {
  GamePalette,
  colors,
  radius,
  sharedStyles,
  spacing,
} from "@/style/theme";
import { PlayerStatus } from "@/types/game";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type StatusBarProps = {
  statuses: PlayerStatus[];
  palette: GamePalette;
};

export default function StatusBar({ statuses, palette }: StatusBarProps) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Pressable
        style={[styles.statusButton, { borderColor: palette.primary }]}
        onPress={() => setVisible(true)}
      >
        <Text style={[styles.statusButtonText, { color: palette.text }]}>
          Statuses ({statuses.length})
        </Text>
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={[styles.modalBox, { borderColor: palette.primary }]}>
            <Text style={[styles.title, { color: palette.text }]}>
              Current Statuses
            </Text>

            <ScrollView style={styles.list}>
              {statuses.length === 0 ? (
                <Text style={styles.emptyText}>No active statuses.</Text>
              ) : (
                statuses.map((status) => (
                  <View key={status.id} style={styles.statusCard}>
                    <Text style={styles.statusName}>{status.name}</Text>

                    <Text style={styles.statusDescription}>
                      {status.description}
                    </Text>

                    <Text style={styles.statusRounds}>
                      Remaining rounds: {status.remainingRounds}
                    </Text>
                  </View>
                ))
              )}
            </ScrollView>

            <Pressable
              style={[
                sharedStyles.primaryButton,
                { backgroundColor: palette.primary },
              ]}
              onPress={() => setVisible(false)}
            >
              <Text style={sharedStyles.buttonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  statusButton: {
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: radius.lg,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  statusButtonText: {
    color: colors.text,
    fontWeight: "bold",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  modalBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: spacing.lg,
    textAlign: "center",
  },
  list: {
    marginBottom: spacing.lg,
  },
  emptyText: {
    color: colors.mutedText,
    textAlign: "center",
    paddingVertical: spacing.xl,
  },
  statusCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  statusName: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  statusDescription: {
    color: colors.mutedText,
    marginTop: spacing.sm,
    fontSize: 15,
    lineHeight: 22,
  },
  statusRounds: {
    color: colors.primaryLight,
    marginTop: spacing.md,
    fontWeight: "bold",
  },
});
