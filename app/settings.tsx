import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { sharedStyles } from "./sharedStyles";

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>General Settings</Text>
      <Text style={styles.text}>Settings content goes here later.</Text>

      <Pressable style={styles.button} onPress={() => router.push("/menu")}>
        <Text style={styles.buttonText}>Back to Menu</Text>
      </Pressable>
    </View>
  );
}

const styles = sharedStyles;