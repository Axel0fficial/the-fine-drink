import AsyncStorage from "@react-native-async-storage/async-storage";

const RESPONSIBLE_WARNING_ENABLED_KEY = "responsible_warning_enabled";

export async function loadResponsibleWarningEnabled(): Promise<boolean> {
  const value = await AsyncStorage.getItem(RESPONSIBLE_WARNING_ENABLED_KEY);

  if (value === null) return true;

  return JSON.parse(value);
}

export async function saveResponsibleWarningEnabled(enabled: boolean) {
  await AsyncStorage.setItem(
    RESPONSIBLE_WARNING_ENABLED_KEY,
    JSON.stringify(enabled),
  );
}
