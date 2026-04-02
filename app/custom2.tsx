import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";

import { useGameStore } from "../src/state/gameStore";

type Difficulty = "easy" | "normal" | "hard" | "brutal";

const DIFFICULTY_OPTIONS: {
  value: Difficulty;
  label: string;
  description: string;
}[] = [
  {
    value: "easy",
    label: "Easy",
    description: "Lighter challenges and safer ranges.",
  },
  {
    value: "normal",
    label: "Normal",
    description: "Balanced experience.",
  },
  {
    value: "hard",
    label: "Hard",
    description: "Stronger challenges and tougher values.",
  },
  {
    value: "brutal",
    label: "Brutal",
    description: "Maximum chaos.",
  },
];

export default function Custom2Screen() {
  const { selectedDifficulty, setSelectedDifficulty } = useGameStore();

  const handleSelectDifficulty = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
  };

  const handleNext = () => {
    router.push("/custom3");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <View>
            <Text style={styles.title}>Custom Mode</Text>
            <Text style={styles.subtitle}>
              Choose the overall difficulty for this match.
            </Text>
          </View>

          <Pressable style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Difficulty</Text>
          <Text style={styles.sectionText}>
            This applies a broad preset to the game. We are keeping it simple for
            now.
          </Text>
        </View>

        <View style={styles.difficultyList}>
          {DIFFICULTY_OPTIONS.map((option) => {
            const isSelected = selectedDifficulty === option.value;

            return (
              <Pressable
                key={option.value}
                style={[
                  styles.difficultyCard,
                  isSelected && styles.difficultyCardActive,
                ]}
                onPress={() => handleSelectDifficulty(option.value)}
              >
                <Text style={styles.difficultyTitle}>{option.label}</Text>
                <Text style={styles.difficultyDescription}>
                  {option.description}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.bottomRow}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.push("/custom1")}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>

          <Pressable style={styles.continueButton} onPress={handleNext}>
            <Text style={styles.continueButtonText}>Continue</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#111111",
  },
  container: {
    flex: 1,
    backgroundColor: "#111111",
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 22,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 24,
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
    maxWidth: 250,
  },
  nextButton: {
    backgroundColor: "#8b5cf6",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  nextButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 8,
  },
  sectionText: {
    color: "#b5b5b5",
    fontSize: 14,
    lineHeight: 20,
  },
  difficultyList: {
    flex: 1,
    gap: 14,
  },
  difficultyCard: {
    backgroundColor: "#1b1b1b",
    borderWidth: 1,
    borderColor: "#2e2e2e",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  difficultyCardActive: {
    backgroundColor: "#2b2144",
    borderColor: "#8b5cf6",
  },
  difficultyTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },
  difficultyDescription: {
    color: "#d0d0d0",
    fontSize: 14,
    lineHeight: 20,
  },
  bottomRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
  },
  backButton: {
    flex: 1,
    backgroundColor: "#2b2b2b",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 15,
  },
  continueButton: {
    flex: 1,
    backgroundColor: "#8b5cf6",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  continueButtonText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 15,
  },
});