import { router } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

export default function WelcomeScreen() {
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/players");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ImageBackground
      source={require("@/assets/images/welcome-bg.png")}
      style={[styles.background, { width, height }]}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>The Fine Drink</Text>
        <Text style={styles.subtitle}>Preparing bad decisions...</Text>

        <ActivityIndicator size="large" color="#EDE7FF" />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    color: "#EDE7FF",
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    color: "#B8A9E6",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
  },
});
