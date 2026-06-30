import * as DocumentPicker from "expo-document-picker";
import { Paths } from "expo-file-system";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

import { Challenge } from "@/types/game";
import {
  loadCustomChallenges,
  saveCustomChallenges,
} from "@/utils/customChallengeStorage";

type CustomChallengeBackup = {
  app: "The Fine Drink";
  type: "custom-challenge-backup";
  version: 1;
  exportedAt: string;
  customChallenges: Challenge[];
};

export async function exportCustomChallenges() {
  const customChallenges = await loadCustomChallenges();

  const backup: CustomChallengeBackup = {
    app: "The Fine Drink",
    type: "custom-challenge-backup",
    version: 1,
    exportedAt: new Date().toISOString(),
    customChallenges,
  };

  const fileUri =
    Paths.document.uri + `/the-fine-drink-custom-challenges-${Date.now()}.json`;

  await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(backup, null, 2));

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri, {
      mimeType: "application/json",
      dialogTitle: "Export Custom Challenges",
    });
  }

  return customChallenges.length;
}

export async function importCustomChallenges() {
  const result = await DocumentPicker.getDocumentAsync({
    type: "application/json",
    copyToCacheDirectory: true,
  });

  if (result.canceled) return null;

  const file = result.assets[0];

  const rawData = await FileSystem.readAsStringAsync(file.uri);
  const parsed = JSON.parse(rawData) as CustomChallengeBackup;

  if (
    parsed.app !== "The Fine Drink" ||
    parsed.type !== "custom-challenge-backup" ||
    !Array.isArray(parsed.customChallenges)
  ) {
    throw new Error("Invalid custom challenge backup file.");
  }

  const existingChallenges = await loadCustomChallenges();

  const existingIds = new Set(
    existingChallenges.map((challenge) => challenge.id),
  );

  const importedChallenges = parsed.customChallenges.map((challenge) => {
    if (!existingIds.has(challenge.id)) return challenge;

    return {
      ...challenge,
      id: `${challenge.id}-imported-${Date.now()}`,
    };
  });

  const mergedChallenges = [...existingChallenges, ...importedChallenges];

  await saveCustomChallenges(mergedChallenges);

  return importedChallenges.length;
}
