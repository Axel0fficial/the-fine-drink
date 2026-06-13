import { GameModifierId, GameModifierSettings } from "@/types/game";
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
const GAME_MODIFIER_SETTINGS_KEY = "game_modifier_settings";

export async function loadGameModifierSettings(): Promise<GameModifierSettings> {
  const rawData = await AsyncStorage.getItem(GAME_MODIFIER_SETTINGS_KEY);

  if (!rawData) return {};

  return JSON.parse(rawData) as GameModifierSettings;
}

export async function saveGameModifierSettings(settings: GameModifierSettings) {
  await AsyncStorage.setItem(
    GAME_MODIFIER_SETTINGS_KEY,
    JSON.stringify(settings),
  );
}
