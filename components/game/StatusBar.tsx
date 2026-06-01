import { useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { colors, radius, sharedStyles, spacing } from "@/style/theme";
import { PlayerStatus } from "@/types/game";

type StatusBarProps = {
  statuses: PlayerStatus[];
};

export default function StatusBar({ statuses }: StatusBarProps) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Pressable style={styles.statusButton} onPress={() => setVisible(true)}>
        <Text style={styles.statusButtonText}>
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
          <View style={styles.modalBox}>
            <Text style={styles.title}>Current Statuses</Text>

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
              style={sharedStyles.primaryButton}
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
    alignSelf: "flex-start",
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.lg,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: spacing.lg,
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
    width: "100%",
    maxHeight: "80%",
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderColor: colors.primary,
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
