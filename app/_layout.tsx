import { Stack } from "expo-router";
import { GameProvider } from "../src/state/gameStore";

export default function RootLayout() {
  return (
    <GameProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" options={{ title: "Welcome" }} />
        <Stack.Screen name="players" options={{ title: "Players" }} />
        <Stack.Screen name="menu" options={{ title: "Menu" }} />
        <Stack.Screen name="settings" options={{ title: "General Settings" }} />
        <Stack.Screen name="custom1" options={{ title: "Custom 1" }} />
        <Stack.Screen name="custom2" options={{ title: "Custom 2" }} />
        <Stack.Screen name="custom3" options={{ title: "Custom 3" }} />
        <Stack.Screen name="game" options={{ title: "Game" }} />
        <Stack.Screen
          name="winner"
          options={{ title: "Winner & Scoreboard" }}
        />
        <Stack.Screen name="leaderboard" options={{ title: "Leaderboard" }} />
      </Stack>
    </GameProvider>
  );
}
