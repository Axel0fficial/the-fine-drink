import { Challenge } from "@/types/game";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CUSTOM_CHALLENGES_KEY = "custom_challenges";

export async function loadCustomChallenges(): Promise<Challenge[]> {
  const rawData = await AsyncStorage.getItem(CUSTOM_CHALLENGES_KEY);

  if (!rawData) return [];

  return JSON.parse(rawData) as Challenge[];
}

export async function saveCustomChallenges(challenges: Challenge[]) {
  await AsyncStorage.setItem(CUSTOM_CHALLENGES_KEY, JSON.stringify(challenges));
}

export async function clearCustomChallenges() {
  await AsyncStorage.removeItem(CUSTOM_CHALLENGES_KEY);
}
