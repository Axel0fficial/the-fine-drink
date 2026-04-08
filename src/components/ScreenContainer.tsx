import React from "react";
import { StyleSheet, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

type Props = {
  children: React.ReactNode;
  backgroundColor?: string;
};

export default function ScreenContainer({
  children,
  backgroundColor = "#111111",
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <View
        style={[
          styles.container,
          {
            backgroundColor,
            paddingTop: 4 + insets.top,
            paddingBottom: 6 + insets.bottom,
          },
        ]}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
  },
});