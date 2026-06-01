import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { sharedStyles } from "../style/theme";

export default function WelcomeScreen() {
  return (
    <View style={sharedStyles.centeredScreen}>
      <Text style={sharedStyles.centeredTitle}>The Fine Drink</Text>

      <Text style={sharedStyles.subtitle}>
        Party challenges. Bad decisions. Good stories.
      </Text>

      <Pressable
        style={sharedStyles.primaryButton}
        onPress={() => router.push("/players")}
      >
        <Text style={sharedStyles.buttonText}>Start Game</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    color: "#fff",
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    color: "#aaa",
    fontSize: 16,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#510996",
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 14,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
