import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import ScreenContainer from "../src/components/ScreenContainer";
import { mockGameModes } from "../src/data/mockGameModes";
import { useGameStore } from "../src/state/gameStore";
import type { GameMode } from "../src/types/game";

export default function MenuScreen() {
  const {
  selectedRounds,
  setSelectedRounds,
  setSelectedGameModeId,
  resetCustomConfig,
} = useGameStore();

  const [roundsInput, setRoundsInput] = useState(String(selectedRounds));

  useEffect(() => {
    setRoundsInput(String(selectedRounds));
  }, [selectedRounds]);

  const handleModePress = (mode: GameMode) => {
    const parsedRounds = Number.parseInt(roundsInput, 10);

    if (!Number.isFinite(parsedRounds) || parsedRounds < 1) {
      setSelectedRounds(6);
      setRoundsInput("6");
    } else {
      setSelectedRounds(parsedRounds);
    }

    setSelectedGameModeId(mode.id);

    if (mode.id === "custom") {
      resetCustomConfig();
    }

    const targetRoute = mode.routeTarget ?? "/game";
    router.push(targetRoute);
  };

  const handleRoundsChange = (value: string) => {
    const cleaned = value.replace(/[^0-9]/g, "");
    setRoundsInput(cleaned);

    if (cleaned === "") return;

    const parsed = Number.parseInt(cleaned, 10);
    if (Number.isFinite(parsed) && parsed >= 1) {
      setSelectedRounds(parsed);
    }
  };

  const handleRoundsBlur = () => {
    const parsed = Number.parseInt(roundsInput, 10);

    if (!Number.isFinite(parsed) || parsed < 1) {
      setSelectedRounds(6);
      setRoundsInput("6");
      return;
    }

    setSelectedRounds(parsed);
    setRoundsInput(String(parsed));
  };

  return (
    <ScreenContainer>
      <View style={styles.topNav}>
        <Pressable
          style={styles.topNavButton}
          onPress={() => router.push("/players")}
        >
          <Text style={styles.topNavButtonText}>Players</Text>
        </Pressable>

        <Pressable
          style={styles.topNavButton}
          onPress={() => router.push("/leaderboard")}
        >
          <Text style={styles.topNavButtonText}>Leaderboard</Text>
        </Pressable>

        <Pressable
          style={styles.topNavButton}
          onPress={() => router.push("/settings")}
        >
          <Text style={styles.topNavButtonText}>Settings</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rounds</Text>

        <TextInput
          value={roundsInput}
          onChangeText={handleRoundsChange}
          onBlur={handleRoundsBlur}
          keyboardType="number-pad"
          style={styles.roundsInput}
          placeholder="6"
          placeholderTextColor="#8b8b8b"
          maxLength={3}
        />
      </View>

      <View style={styles.body}>
        <Text style={styles.sectionTitle}>Game Modes</Text>

        <View style={styles.modesList}>
          {mockGameModes.map((mode) => (
            <Pressable
              key={mode.id}
              style={styles.modeButton}
              onPress={() => handleModePress(mode)}
            >
              <Text style={styles.modeTitle}>{mode.name}</Text>
              {!!mode.description && (
                <Text style={styles.modeDescription}>{mode.description}</Text>
              )}
            </Pressable>
          ))}
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topNav: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 22,
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
  topNavButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 14,
  },
  roundsInput: {
    width: 110,
    backgroundColor: "#1b1b1b",
    borderWidth: 1,
    borderColor: "#313131",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  body: {
    flex: 1,
  },
  modesList: {
    alignItems: "flex-start",
    gap: 14,
  },
  modeButton: {
    width: "70%",
    backgroundColor: "#1d1d1d",
    borderWidth: 1,
    borderColor: "#313131",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  modeTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },
  modeDescription: {
    color: "#b5b5b5",
    fontSize: 13,
    lineHeight: 18,
  },
});
