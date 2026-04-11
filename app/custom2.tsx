import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS, sharedStyles } from "../app/sharedStyles";
import ScreenContainer from "../src/components/ScreenContainer";
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
    <ScreenContainer>
      <View style={sharedStyles.topBar}>
        <View style={styles.titleWrap}>
          <Text style={sharedStyles.title}>Custom Mode</Text>
          <Text style={sharedStyles.subtitle}>
            Choose the overall difficulty for this match.
          </Text>
        </View>

        <Pressable style={sharedStyles.smallActionButton} onPress={handleNext}>
          <Text style={sharedStyles.smallActionButtonText}>Next</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={sharedStyles.sectionTitle}>Difficulty</Text>
        <Text style={sharedStyles.sectionText}>
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

      <View style={sharedStyles.bottomActions}>
        <Pressable
          style={[sharedStyles.secondaryButton, styles.actionButton]}
          onPress={() => router.push("/custom1")}
        >
          <Text style={sharedStyles.secondaryButtonText}>Back</Text>
        </Pressable>

        <Pressable
          style={[sharedStyles.primaryButton, styles.actionButton]}
          onPress={handleNext}
        >
          <Text style={sharedStyles.primaryButtonText}>Continue</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  titleWrap: {
    flex: 1,
    paddingRight: 12,
  },

  section: {
    marginBottom: 18,
  },

  difficultyList: {
    flex: 1,
    gap: 14,
  },

  difficultyCard: {
    backgroundColor: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.purple,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
  },

  difficultyCardActive: {
    backgroundColor: COLORS.purpleDark,
    borderColor: COLORS.purple,
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

  actionButton: {
    flex: 1,
  },
});
