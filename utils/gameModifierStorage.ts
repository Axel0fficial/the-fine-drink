import { GameModifierId } from "@/types/game";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GAME_MODIFIERS_KEY = "game_modifiers";

export async function loadEnabledGameModifiers(): Promise<GameModifierId[]> {
  const rawData = await AsyncStorage.getItem(GAME_MODIFIERS_KEY);

  if (!rawData) return [];

  return JSON.parse(rawData) as GameModifierId[];
}

export async function saveEnabledGameModifiers(ids: GameModifierId[]) {
  await AsyncStorage.setItem(GAME_MODIFIERS_KEY, JSON.stringify(ids));
}
