import { router } from "expo-router";
import { Pressable, Text } from "react-native";
import ScreenContainer from "../src/components/ScreenContainer";
import { sharedStyles } from "./sharedStyles";

export default function SettingsScreen() {
  return (
    <ScreenContainer>
      <Text style={styles.title}>General Settings</Text>
      <Text style={styles.text}>Settings content goes here later.</Text>

      <Pressable style={styles.button} onPress={() => router.push("/menu")}>
        <Text style={styles.buttonText}>Back to Menu</Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = sharedStyles;
