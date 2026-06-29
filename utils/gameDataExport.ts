import { challenges as defaultChallenges } from "@/data/challenges";
import { loadChallengePreferences } from "@/utils/challengeStorage";
import { loadCustomChallenges } from "@/utils/customChallengeStorage";
import { getOrCreateDeviceId } from "@/utils/deviceIdStorage";

const GAME_DATA_ENDPOINT =
  "https://axel0fficial.tech/wp-json/the-fine-drink/v1/game-data";

export type ChallengeExportData = {
  id: string;
  isFavorite: boolean;
  likes: number;
  dislikes: number;
};

export type GameDataExportPayload = {
  deviceId: string;
  sentAt: string;
  app: string;
  version: string;
  challenges: ChallengeExportData[];
  customChallengeCount: number;
};
export async function buildGameDataExportPayload(): Promise<GameDataExportPayload> {
  const deviceId = await getOrCreateDeviceId();
  const challengePreferences = await loadChallengePreferences();
  const customChallenges = await loadCustomChallenges();

  const challenges = defaultChallenges.map((challenge) => {
    const savedPreference = challengePreferences.find(
      (item) => item.id === challenge.id,
    );

    return {
      id: challenge.id,
      isFavorite: savedPreference?.isFavorite ?? challenge.isFavorite,
      likes: savedPreference?.likes ?? challenge.likes,
      dislikes: savedPreference?.dislikes ?? challenge.dislikes,
    };
  });

  return {
    deviceId,
    sentAt: new Date().toISOString(),
    app: "The Fine Drink",
    version: "1.0.0",
    challenges,
    customChallengeCount: customChallenges.length,
  };
}

export async function sendGameDataExport() {
  const payload = await buildGameDataExportPayload();

  const response = await fetch(GAME_DATA_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-tfd-api-key": "CHANGE_THIS_TO_A_LONG_SECRET_KEY",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to send game data. Status: ${response.status}`);
  }

  return payload;
}
