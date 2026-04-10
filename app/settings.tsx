import { router } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

import ScreenContainer from "../src/components/ScreenContainer";
import { useGameStore } from "../src/state/gameStore";
import { sharedStyles } from "./sharedStyles";

export default function SettingsScreen() {
  const [resetModalVisible, setResetModalVisible] = useState(false);

  const [challengeModalVisible, setChallengeModalVisible] = useState(false);

  const {
    resetChallenges,
    resetPlayerProfiles,
    resetLeaderboard,
    resetSelectedPlayers,
    resetAllData,
    challenges,
    globallyDisabledChallengeIds,
    setGloballyDisabledChallengeIds,
  } = useGameStore();

  const toggleGlobalChallengeEnabled = (challengeId: string) => {
    setGloballyDisabledChallengeIds((prev) =>
      prev.includes(challengeId)
        ? prev.filter((id) => id !== challengeId)
        : [...prev, challengeId],
    );
  };

  const runReset = async (action: () => void | Promise<void>) => {
    await action();
    setResetModalVisible(false);
  };

  return (
    <ScreenContainer>
      <View style={sharedStyles.header}>
        <Text style={sharedStyles.title}>Settings</Text>
        <Text style={sharedStyles.subtitle}>
          Manage testing data, saved profiles, challenges, and leaderboard data.
        </Text>
      </View>
      <View style={sharedStyles.section}>
        <Text style={sharedStyles.sectionTitle}>Challenge Panel</Text>
        <Text style={[sharedStyles.sectionText, styles.sectionTextSpacing]}>
          Open the challenge panel to enable or disable them.
        </Text>
        <Pressable
          style={sharedStyles.secondaryButton}
          onPress={() => setChallengeModalVisible(true)}
        >
          <Text style={sharedStyles.secondaryButtonText}>
            Global Challenge Availability
          </Text>
        </Pressable>
      </View>

      <View style={sharedStyles.section}>
        <Text style={sharedStyles.sectionTitle}>Data Tools</Text>
        <Text style={[sharedStyles.sectionText, styles.sectionTextSpacing]}>
          Open the reset panel to clear testing data individually or all at
          once.
        </Text>

        <Pressable
          style={sharedStyles.primaryButton}
          onPress={() => setResetModalVisible(true)}
        >
          <Text style={sharedStyles.primaryButtonText}>Open Reset Tools</Text>
        </Pressable>
      </View>

      <View style={sharedStyles.bottomActions}>
        <Pressable
          style={sharedStyles.secondaryButton}
          onPress={() => router.push("/menu")}
        >
          <Text style={sharedStyles.secondaryButtonText}>Back to Menu</Text>
        </Pressable>
      </View>

      <Modal
        visible={resetModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setResetModalVisible(false)}
      >
        <View style={sharedStyles.modalBackdrop}>
          <View style={sharedStyles.modalCard}>
            <View style={sharedStyles.modalHeader}>
              <Text style={sharedStyles.modalTitle}>Reset Data</Text>
              <Pressable onPress={() => setResetModalVisible(false)}>
                <Text style={sharedStyles.modalCloseText}>Close</Text>
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={sharedStyles.modalDescription}>
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
      <Modal
        visible={challengeModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setChallengeModalVisible(false)}
      >
        <View style={sharedStyles.modalBackdrop}>
          <View style={sharedStyles.modalCard}>
            <View style={sharedStyles.modalHeader}>
              <Text style={sharedStyles.modalTitle}>
                Global Challenge Availability
              </Text>
              <Pressable onPress={() => setChallengeModalVisible(false)}>
                <Text style={sharedStyles.modalCloseText}>Close</Text>
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={sharedStyles.modalDescription}>
                Disable challenges here if you never want them to appear in any
                game mode on this device.
              </Text>

              {challenges.map((challenge) => {
                const enabled = !globallyDisabledChallengeIds.includes(
                  challenge.id,
                );

                return (
                  <View key={challenge.id} style={styles.challengeRow}>
                    <View style={styles.challengeRowText}>
                      <Text style={styles.challengeRowTitle}>
                        {challenge.title}
                      </Text>
                      <Text style={styles.challengeRowMeta}>
                        {challenge.categories.join(", ")}
                      </Text>
                    </View>

                    <Switch
                      value={enabled}
                      onValueChange={() =>
                        toggleGlobalChallengeEnabled(challenge.id)
                      }
                    />
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  sectionTextSpacing: {
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
  challengeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },

  challengeRowText: {
    flex: 1,
  },

  challengeRowTitle: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },

  challengeRowMeta: {
    marginTop: 4,
    color: "#9ca3af",
    fontSize: 12,
    lineHeight: 18,
  },
});
