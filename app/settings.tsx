import { router } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import ScreenContainer from "../src/components/ScreenContainer";
import { useGameStore } from "../src/state/gameStore";

export default function SettingsScreen() {
  const [resetModalVisible, setResetModalVisible] = useState(false);

  const {
    resetChallenges,
    resetPlayerProfiles,
    resetLeaderboard,
    resetSelectedPlayers,
    resetAllData,
  } = useGameStore();

  const runReset = async (action: () => void | Promise<void>) => {
    await action();
    setResetModalVisible(false);
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>
          Manage testing data, saved profiles, challenges, and leaderboard data.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Tools</Text>
        <Text style={styles.sectionText}>
          Open the reset panel to clear testing data individually or all at once.
        </Text>

        <Pressable
          style={styles.primaryButton}
          onPress={() => setResetModalVisible(true)}
        >
          <Text style={styles.primaryButtonText}>Open Reset Tools</Text>
        </Pressable>
      </View>

      <View style={styles.bottomActions}>
        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.push("/menu")}
        >
          <Text style={styles.secondaryButtonText}>Back to Menu</Text>
        </Pressable>
      </View>

      <Modal
        visible={resetModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setResetModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reset Data</Text>
              <Pressable onPress={() => setResetModalVisible(false)}>
                <Text style={styles.modalCloseText}>Close</Text>
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalDescription}>
                Use these options to clean testing data without clearing app
                cache manually.
              </Text>

              <Pressable
                style={styles.resetButton}
                onPress={() => runReset(resetChallenges)}
              >
                <Text style={styles.resetButtonTitle}>Reset Challenges</Text>
                <Text style={styles.resetButtonText}>
                  Remove custom challenges and restore defaults.
                </Text>
              </Pressable>

              <Pressable
                style={styles.resetButton}
                onPress={() => runReset(resetPlayerProfiles)}
              >
                <Text style={styles.resetButtonTitle}>Reset Players</Text>
                <Text style={styles.resetButtonText}>
                  Restore the original reusable player list.
                </Text>
              </Pressable>

              <Pressable
                style={styles.resetButton}
                onPress={() => runReset(resetLeaderboard)}
              >
                <Text style={styles.resetButtonTitle}>Reset Leaderboard</Text>
                <Text style={styles.resetButtonText}>
                  Clear saved score history for cleaner testing.
                </Text>
              </Pressable>

              <Pressable
                style={styles.resetButton}
                onPress={() => runReset(resetSelectedPlayers)}
              >
                <Text style={styles.resetButtonTitle}>Reset Current Match</Text>
                <Text style={styles.resetButtonText}>
                  Clear the players currently loaded into the match.
                </Text>
              </Pressable>

              <Pressable
                style={[styles.resetButton, styles.dangerButton]}
                onPress={() => runReset(resetAllData)}
              >
                <Text style={styles.dangerButtonTitle}>Reset Everything</Text>
                <Text style={styles.dangerButtonText}>
                  Restore the app to its default seeded state.
                </Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: "#b5b5b5",
  },
  section: {
    backgroundColor: "#171717",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#aaaaaa",
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: "#8b5cf6",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 15,
  },
  bottomActions: {
    marginTop: 18,
  },
  secondaryButton: {
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.72)",
    justifyContent: "center",
    padding: 18,
  },
  modalCard: {
    maxHeight: "82%",
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
    fontSize: 22,
    fontWeight: "800",
  },
  modalCloseText: {
    color: "#8b5cf6",
    fontSize: 15,
    fontWeight: "700",
  },
  modalDescription: {
    color: "#aaaaaa",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  resetButton: {
    backgroundColor: "#202020",
    borderWidth: 1,
    borderColor: "#313131",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  resetButtonTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4,
  },
  resetButtonText: {
    color: "#b3b3b3",
    fontSize: 13,
    lineHeight: 18,
  },
  dangerButton: {
    borderColor: "#7f1d1d",
    backgroundColor: "#2a1616",
  },
  dangerButtonTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4,
  },
  dangerButtonText: {
    color: "#f0b4b4",
    fontSize: 13,
    lineHeight: 18,
  },
});