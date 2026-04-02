import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

import { mockChallenges } from "../data/MockChallenges";
import { mockModifiers } from "../data/mockModifiers";
import type {
  Challenge,
  Difficulty,
  GamePlayer,
  SessionModifier,
} from "../types/game";

const STORAGE_KEY = "fine_drink_custom_config";

const DEFAULT_CATEGORIES = [
  "individual",
  "group",
  "quantity",
  "status",
  "timed",
  "reaction",
  "social",
];

type GameStore = {
  selectedPlayers: GamePlayer[];
  challenges: Challenge[];
  enabledCategories: string[];
  selectedDifficulty: Difficulty;
  modifiers: SessionModifier[];

  setSelectedPlayers: React.Dispatch<React.SetStateAction<GamePlayer[]>>;
  setModifiers: React.Dispatch<React.SetStateAction<SessionModifier[]>>;
  setChallenges: React.Dispatch<React.SetStateAction<Challenge[]>>;
  setEnabledCategories: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedDifficulty: React.Dispatch<React.SetStateAction<Difficulty>>;

  resetCustomConfig: () => void;
};

const GameContext = createContext<GameStore | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [selectedPlayers, setSelectedPlayers] = useState<GamePlayer[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>(mockChallenges);
  const [modifiers, setModifiers] = useState<SessionModifier[]>(mockModifiers);
  const [enabledCategories, setEnabledCategories] =
    useState<string[]>(DEFAULT_CATEGORIES);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>("normal");

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) return;

        const parsed = JSON.parse(raw);

        if (parsed.selectedPlayers) setSelectedPlayers(parsed.selectedPlayers);
        if (parsed.challenges) setChallenges(parsed.challenges);
        if (parsed.enabledCategories) setEnabledCategories(parsed.enabledCategories);
        if (parsed.selectedDifficulty) setSelectedDifficulty(parsed.selectedDifficulty);
        if (parsed.modifiers) setModifiers(parsed.modifiers);
      } catch (err) {
        console.log("Load error:", err);
      }
    };

    load();
  }, []);

  useEffect(() => {
    const save = async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            selectedPlayers,
            challenges,
            enabledCategories,
            selectedDifficulty,
            modifiers,
          })
        );
      } catch (err) {
        console.log("Save error:", err);
      }
    };

    save();
  }, [selectedPlayers, challenges, enabledCategories, selectedDifficulty, modifiers]);

  const resetCustomConfig = () => {
    setSelectedPlayers([]);
    setChallenges(mockChallenges);
    setModifiers(mockModifiers);
    setEnabledCategories(DEFAULT_CATEGORIES);
    setSelectedDifficulty("normal");
  };

  return (
    <GameContext.Provider
      value={{
        selectedPlayers,
        challenges,
        enabledCategories,
        selectedDifficulty,
        modifiers,
        setSelectedPlayers,
        setChallenges,
        setEnabledCategories,
        setSelectedDifficulty,
        setModifiers,
        resetCustomConfig,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGameStore() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGameStore must be used inside GameProvider");
  return ctx;
}