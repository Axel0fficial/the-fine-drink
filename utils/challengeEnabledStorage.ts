import AsyncStorage from "@react-native-async-storage/async-storage";

const CHALLENGE_ENABLED_KEY = "challenge_enabled_settings";

export type ChallengeEnabledSetting = {
  id: string;
  enabled: boolean;
};

export async function loadChallengeEnabledSettings(): Promise<
  ChallengeEnabledSetting[]
> {
  const rawData = await AsyncStorage.getItem(CHALLENGE_ENABLED_KEY);

  if (!rawData) return [];

  return JSON.parse(rawData) as ChallengeEnabledSetting[];
}

export async function saveChallengeEnabledSettings(
  settings: ChallengeEnabledSetting[],
) {
  await AsyncStorage.setItem(CHALLENGE_ENABLED_KEY, JSON.stringify(settings));
}

export function applyChallengeEnabledSettings<
  T extends { id: string; enabled: boolean },
>(challenges: T[], settings: ChallengeEnabledSetting[]): T[] {
  return challenges.map((challenge) => {
    const setting = settings.find((item) => item.id === challenge.id);

    if (!setting) return challenge;

    return {
      ...challenge,
      enabled: setting.enabled,
    };
  });
}
