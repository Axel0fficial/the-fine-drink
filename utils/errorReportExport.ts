import { loadCustomChallenges } from "@/utils/customChallengeStorage";
import { getOrCreateDeviceId } from "@/utils/deviceIdStorage";
import { sendGameDataExport } from "@/utils/gameDataExport";

const ERROR_REPORT_ENDPOINT =
  "https://axel0fficial.tech/wp-json/the-fine-drink/v1/reports";

const API_KEY = "CHANGE_THIS_TO_A_LONG_SECRET_KEY";

export type ErrorReportInput = {
  name: string;
  message: string;
  email?: string;
};

export async function sendErrorReport(input: ErrorReportInput) {
  const deviceId = await getOrCreateDeviceId();
  const customChallenges = await loadCustomChallenges();

  const payload = {
    deviceId,
    sentAt: new Date().toISOString(),
    app: "The Fine Drink",
    version: "1.0.0",

    reporter: {
      name: input.name,
      email: input.email || null,
    },

    message: input.message,
    customChallenges,
    customChallengeCount: customChallenges.length,
  };

  const response = await fetch(ERROR_REPORT_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-tfd-api-key": API_KEY,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to send error report. Status: ${response.status}`);
  }

  await sendGameDataExport();

  return payload;
}
