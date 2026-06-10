import { Player, SavedPlayer } from "@/types/game";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SAVED_PLAYERS_KEY = "saved_players";
const LAST_SESSION_PLAYERS_KEY = "last_session_players";

export async function loadSavedPlayers(): Promise<SavedPlayer[]> {
  const rawData = await AsyncStorage.getItem(SAVED_PLAYERS_KEY);

  if (!rawData) return [];

  return JSON.parse(rawData) as SavedPlayer[];
}

export async function saveSavedPlayers(players: SavedPlayer[]) {
  await AsyncStorage.setItem(SAVED_PLAYERS_KEY, JSON.stringify(players));
}
export async function clearSavedPlayers() {
  await AsyncStorage.removeItem(SAVED_PLAYERS_KEY);
}
export function savedPlayerToSessionPlayer(savedPlayer: SavedPlayer): Player {
  return {
    id: savedPlayer.id,
    name: savedPlayer.name,
    score: 0,
    statuses: [],
    preferences: savedPlayer.preferences,
    team: "none",
  };
}

export async function loadLastSessionPlayerIds(): Promise<string[]> {
  const rawData = await AsyncStorage.getItem(LAST_SESSION_PLAYERS_KEY);

  if (!rawData) return [];

  return JSON.parse(rawData) as string[];
}

export async function saveLastSessionPlayerIds(playerIds: string[]) {
  await AsyncStorage.setItem(
    LAST_SESSION_PLAYERS_KEY,
    JSON.stringify(playerIds),
  );
}

export async function clearLastSessionPlayerIds() {
  await AsyncStorage.removeItem(LAST_SESSION_PLAYERS_KEY);
}
