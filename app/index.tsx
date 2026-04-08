import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/fdTransparentWhite.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.subtitle}>A game hidden in the fine print</Text>

      <Pressable style={styles.button} onPress={() => router.push("/players")}>
        <Text style={styles.buttonText}>Start</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  logo: {
    width: 260,
    height: 120,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#bbb",
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#8b5cf6",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});