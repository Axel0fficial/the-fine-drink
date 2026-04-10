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
  customModeEnabledCategories: string[];
  customModeDisabledChallengeIds: string[];
  selectedDifficulty: Difficulty;
  selectedRounds: number;
  selectedGameModeId: string | null;
  modifiers: SessionModifier[];
  leaderboardEntries: LeaderboardEntry[];
  playerProfiles: PlayerProfile[];
  globallyDisabledChallengeIds: string[];
  setGloballyDisabledChallengeIds: React.Dispatch<
    React.SetStateAction<string[]>
  >;

  setPlayerProfiles: React.Dispatch<React.SetStateAction<PlayerProfile[]>>;
  setSelectedPlayers: React.Dispatch<React.SetStateAction<GamePlayer[]>>;
  setModifiers: React.Dispatch<React.SetStateAction<SessionModifier[]>>;
  setChallenges: React.Dispatch<React.SetStateAction<Challenge[]>>;
  setEnabledCategories: React.Dispatch<React.SetStateAction<string[]>>;
  setCustomModeEnabledCategories: React.Dispatch<
    React.SetStateAction<string[]>
  >;
  setCustomModeDisabledChallengeIds: React.Dispatch<
    React.SetStateAction<string[]>
  >;
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
  const [playerProfiles, setPlayerProfiles] =
    useState<PlayerProfile[]>(mockPlayers);
  const [challenges, setChallenges] = useState<Challenge[]>(mockChallenges);
  const [modifiers, setModifiers] = useState<SessionModifier[]>(mockModifiers);
  const [globallyDisabledChallengeIds, setGloballyDisabledChallengeIds] =
    useState<string[]>([]);

  // Keep this as a future/global setting bucket if you still want it later.
  const [enabledCategories, setEnabledCategories] =
    useState<string[]>(DEFAULT_CATEGORIES);

  // Custom Mode only
  const [customModeEnabledCategories, setCustomModeEnabledCategories] =
    useState<string[]>(DEFAULT_CATEGORIES);
  const [customModeDisabledChallengeIds, setCustomModeDisabledChallengeIds] =
    useState<string[]>([]);

  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>("normal");
  const [selectedRounds, setSelectedRounds] = useState<number>(6);
  const [selectedGameModeId, setSelectedGameModeId] = useState<string | null>(
    null,
  );
  const [leaderboardEntries, setLeaderboardEntries] =
    useState<LeaderboardEntry[]>(mockLeaderboard);

  const LEGACY_SELECTED_PLAYERS_KEY = "thefinedrink:selectedPlayers";

  const resetPlayerProfiles = async () => {
    setPlayerProfiles(mockPlayers);
    await AsyncStorage.removeItem(LEGACY_SELECTED_PLAYERS_KEY);
  };

  const resetChallenges = async () => {
    setChallenges(mockChallenges);
    setCustomModeDisabledChallengeIds([]);
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
    setCustomModeEnabledCategories(DEFAULT_CATEGORIES);
    setCustomModeDisabledChallengeIds([]);
    setSelectedDifficulty("normal");
    setSelectedRounds(6);
    setSelectedGameModeId(null);
    setGloballyDisabledChallengeIds([]);
    setLeaderboardEntries(mockLeaderboard);
    await AsyncStorage.removeItem(LEGACY_SELECTED_PLAYERS_KEY);
  };

  const resetMatchScores = () => {
    setSelectedPlayers((prev) =>
      prev.map((player) => ({
        ...player,
        score: 0,
      })),
    );
  };

  const resetCustomConfig = () => {
    setCustomModeEnabledCategories(DEFAULT_CATEGORIES);
    setCustomModeDisabledChallengeIds([]);
    setModifiers(mockModifiers);
    setSelectedDifficulty("normal");
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
        if (parsed.customModeEnabledCategories)
          setCustomModeEnabledCategories(parsed.customModeEnabledCategories);
        if (parsed.customModeDisabledChallengeIds)
          setCustomModeDisabledChallengeIds(
            parsed.customModeDisabledChallengeIds,
          );
        if (parsed.selectedDifficulty)
          setSelectedDifficulty(parsed.selectedDifficulty);
        if (parsed.selectedRounds) setSelectedRounds(parsed.selectedRounds);
        if (parsed.selectedGameModeId)
          setSelectedGameModeId(parsed.selectedGameModeId);
        if (parsed.modifiers) setModifiers(parsed.modifiers);
        if (parsed.globallyDisabledChallengeIds) {
          setGloballyDisabledChallengeIds(parsed.globallyDisabledChallengeIds);
        }
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
            customModeEnabledCategories,
            customModeDisabledChallengeIds,
            selectedDifficulty,
            selectedRounds,
            selectedGameModeId,
            modifiers,
            globallyDisabledChallengeIds,
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
    customModeEnabledCategories,
    customModeDisabledChallengeIds,
    selectedDifficulty,
    selectedRounds,
    selectedGameModeId,
    modifiers,
    globallyDisabledChallengeIds,
    leaderboardEntries,
  ]);

  return (
    <GameContext.Provider
      value={{
        selectedPlayers,
        challenges,
        enabledCategories,
        customModeEnabledCategories,
        customModeDisabledChallengeIds,
        selectedDifficulty,
        selectedRounds,
        selectedGameModeId,
        modifiers,
        globallyDisabledChallengeIds,
        playerProfiles,
        leaderboardEntries,
        setPlayerProfiles,
        setSelectedPlayers,
        setChallenges,
        setEnabledCategories,
        setCustomModeEnabledCategories,
        setCustomModeDisabledChallengeIds,
        setSelectedDifficulty,
        setSelectedRounds,
        setSelectedGameModeId,
        setModifiers,
        setGloballyDisabledChallengeIds,
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
