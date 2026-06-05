import AsyncStorage from "@react-native-async-storage/async-storage";

const DRINKY_ENABLED_KEY = "drinky_enabled";

export async function loadDrinkyEnabled(): Promise<boolean> {
  const value = await AsyncStorage.getItem(DRINKY_ENABLED_KEY);
  if (value === null) return true;

  return JSON.parse(value);
}

export async function saveDrinkyEnabled(enabled: boolean) {
  await AsyncStorage.setItem(DRINKY_ENABLED_KEY, JSON.stringify(enabled));
}
