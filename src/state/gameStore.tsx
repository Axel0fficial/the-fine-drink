import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

import { mockChallenges } from "../data/MockChallenges";
import { mockLeaderboard } from "../data/mockLeaderboard";
import { mockModifiers } from "../data/mockModifiers";
import { mockPlayers } from "../data/mockPlayers";
import type {
  Challenge,
  Difficulty,
  GamePlayer,
  LeaderboardEntry,
  PlayerProfile,
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
  selectedRounds: number;
  selectedGameModeId: string | null;
  modifiers: SessionModifier[];
  leaderboardEntries: LeaderboardEntry[];
  playerProfiles: PlayerProfile[];

  setPlayerProfiles: React.Dispatch<React.SetStateAction<PlayerProfile[]>>;
  setSelectedPlayers: React.Dispatch<React.SetStateAction<GamePlayer[]>>;
  setModifiers: React.Dispatch<React.SetStateAction<SessionModifier[]>>;
  setChallenges: React.Dispatch<React.SetStateAction<Challenge[]>>;
  setEnabledCategories: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedDifficulty: React.Dispatch<React.SetStateAction<Difficulty>>;
  setSelectedRounds: React.Dispatch<React.SetStateAction<number>>;
  setSelectedGameModeId: React.Dispatch<React.SetStateAction<string | null>>;
  setLeaderboardEntries: React.Dispatch<
    React.SetStateAction<LeaderboardEntry[]>
  >;
  resetMatchScores: () => void;

  resetCustomConfig: () => void;
  resetPlayerProfiles: () => void;
  resetChallenges: () => void;
  resetLeaderboard: () => void;
  resetSelectedPlayers: () => void;
  resetAllData: () => void;
};

const GameContext = createContext<GameStore | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [selectedPlayers, setSelectedPlayers] = useState<GamePlayer[]>([]);
  const [playerProfiles, setPlayerProfiles] = useState<PlayerProfile[]>(mockPlayers);
  const [challenges, setChallenges] = useState<Challenge[]>(mockChallenges);
  const [modifiers, setModifiers] = useState<SessionModifier[]>(mockModifiers);
  const [enabledCategories, setEnabledCategories] =
    useState<string[]>(DEFAULT_CATEGORIES);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>("normal");
  const [selectedRounds, setSelectedRounds] = useState<number>(6);
  const [selectedGameModeId, setSelectedGameModeId] = useState<string | null>(
    null,
  );
  const LEGACY_SELECTED_PLAYERS_KEY = "thefinedrink:selectedPlayers";

  const resetPlayerProfiles = async () => {
    setPlayerProfiles(mockPlayers);
    await AsyncStorage.removeItem(LEGACY_SELECTED_PLAYERS_KEY);
  };

  const resetChallenges = async () => {
    setChallenges(mockChallenges);
  };

  const resetLeaderboard = async () => {
    setLeaderboardEntries(mockLeaderboard);
    setSelectedPlayers([]);
    setSelectedGameModeId(null);
  };

  const resetSelectedPlayers = async () => {
    setSelectedPlayers([]);
    await AsyncStorage.removeItem(LEGACY_SELECTED_PLAYERS_KEY);
  };

  const resetAllData = async () => {
    setSelectedPlayers([]);
    setPlayerProfiles(mockPlayers);
    setChallenges(mockChallenges);
    setModifiers(mockModifiers);
    setEnabledCategories(DEFAULT_CATEGORIES);
    setSelectedDifficulty("normal");
    setSelectedRounds(6);
    setSelectedGameModeId(null);
    setLeaderboardEntries(mockLeaderboard);
    await AsyncStorage.removeItem(LEGACY_SELECTED_PLAYERS_KEY);
  };
  const [leaderboardEntries, setLeaderboardEntries] =
    useState<LeaderboardEntry[]>(mockLeaderboard);

  const resetMatchScores = () => {
    setSelectedPlayers((prev) =>
      prev.map((player) => ({
        ...player,
        score: 0,
      })),
    );
  };

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) return;

        const parsed = JSON.parse(raw);

        if (parsed.selectedPlayers) setSelectedPlayers(parsed.selectedPlayers);
        if (parsed.challenges) setChallenges(parsed.challenges);
        if (parsed.playerProfiles) setPlayerProfiles(parsed.playerProfiles);
        if (parsed.enabledCategories)
          setEnabledCategories(parsed.enabledCategories);
        if (parsed.selectedDifficulty)
          setSelectedDifficulty(parsed.selectedDifficulty);
        if (parsed.selectedRounds) setSelectedRounds(parsed.selectedRounds);
        if (parsed.selectedGameModeId)
          setSelectedGameModeId(parsed.selectedGameModeId);
        if (parsed.modifiers) setModifiers(parsed.modifiers);
        if (parsed.leaderboardEntries)
          setLeaderboardEntries(parsed.leaderboardEntries);
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
            playerProfiles,
            challenges,
            enabledCategories,
            selectedDifficulty,
            selectedRounds,
            selectedGameModeId,
            modifiers,
            leaderboardEntries,
          }),
        );
      } catch (err) {
        console.log("Save error:", err);
      }
    };

    save();
  }, [
  selectedPlayers,
  playerProfiles,
  challenges,
  enabledCategories,
  selectedDifficulty,
  selectedRounds,
  selectedGameModeId,
  modifiers,
  leaderboardEntries,
]);

  const resetCustomConfig = () => {
    setSelectedPlayers([]);
    setChallenges(mockChallenges);
    setModifiers(mockModifiers);
    setEnabledCategories(DEFAULT_CATEGORIES);
    setSelectedDifficulty("normal");
    setSelectedRounds(6);
    setSelectedGameModeId(null);
  };

  return (
    <GameContext.Provider
      value={{
        selectedPlayers,
        challenges,
        enabledCategories,
        selectedDifficulty,
        selectedRounds,
        selectedGameModeId,
        modifiers,
        playerProfiles,
        leaderboardEntries,
        setPlayerProfiles,
        setSelectedPlayers,
        setChallenges,
        setEnabledCategories,
        setSelectedDifficulty,
        setSelectedRounds,
        setSelectedGameModeId,
        setModifiers,
        setLeaderboardEntries,
        resetCustomConfig,
        resetMatchScores,
        resetPlayerProfiles,
        resetChallenges,
        resetLeaderboard,
        resetSelectedPlayers,
        resetAllData,
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
