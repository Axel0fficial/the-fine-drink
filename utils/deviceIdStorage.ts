import AsyncStorage from "@react-native-async-storage/async-storage";

const DEVICE_ID_KEY = "the_fine_drink_device_id";

const DEVICE_ID_ENDPOINT =
  "https://axel0fficial.tech/wp-json/the-fine-drink/v1/device-id";

const API_KEY = "CHANGE_THIS_TO_A_LONG_SECRET_KEY";

export async function loadDeviceId() {
  return AsyncStorage.getItem(DEVICE_ID_KEY);
}

export async function saveDeviceId(deviceId: string) {
  return AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
}

export async function getOrCreateDeviceId() {
  const existingDeviceId = await loadDeviceId();

  const response = await fetch(DEVICE_ID_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-tfd-api-key": API_KEY,
    },
    body: JSON.stringify({
      deviceId: existingDeviceId,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get device ID. Status: ${response.status}`);
  }

  const result = await response.json();

  if (!result.deviceId) {
    throw new Error("Server did not return a device ID.");
  }

  await saveDeviceId(result.deviceId);

  return result.deviceId;
}
