import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import ScreenContainer from "../src/components/ScreenContainer";
import { mockGameModes } from "../src/data/mockGameModes";
import type { GameMode } from "../src/types/game";

export default function MenuScreen() {
  const handleModePress = (mode: GameMode) => {
    const targetRoute = mode.routeTarget ?? "/game";
    router.push(targetRoute);
  };

  return (
    <ScreenContainer>
      <Text style={styles.title}>Menu</Text>
      <Text style={styles.subtitle}>Choose a mode and start the game.</Text>

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
  body: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 16,
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
