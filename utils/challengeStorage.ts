import { Challenge } from "@/types/game";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CHALLENGE_PREFS_KEY = "challenge_preferences";

export type ChallengePreference = {
  id: string;
  isFavorite: boolean;
  likes: number;
  dislikes: number;
};

export async function saveChallengePreferences(challenges: Challenge[]) {
  const preferences: ChallengePreference[] = challenges.map((challenge) => ({
    id: challenge.id,
    isFavorite: challenge.isFavorite,
    likes: challenge.likes,
    dislikes: challenge.dislikes,
  }));

  await AsyncStorage.setItem(CHALLENGE_PREFS_KEY, JSON.stringify(preferences));
}

export async function loadChallengePreferences() {
  const rawData = await AsyncStorage.getItem(CHALLENGE_PREFS_KEY);

  if (!rawData) return [];

  return JSON.parse(rawData) as ChallengePreference[];
}

export function applyChallengePreferences(
  challenges: Challenge[],
  preferences: ChallengePreference[],
) {
  return challenges.map((challenge) => {
    const preference = preferences.find((item) => item.id === challenge.id);

    if (!preference) return challenge;

    return {
      ...challenge,
      isFavorite: preference.isFavorite,
      likes: preference.likes,
      dislikes: preference.dislikes,
    };
  });
}
