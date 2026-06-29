import { router } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import ImageSlideshowModal from "@/components/guide/ImageSlideshowModal";
import { howToGuides } from "@/data/howToGuides";
import { colors, radius, sharedStyles, spacing } from "@/style/theme";

type SelectedGuide = (typeof howToGuides)[number] | null;

export default function HowToScreen() {
  const [selectedGuide, setSelectedGuide] = useState<SelectedGuide>(null);

  return (
    <View style={[sharedStyles.screen, styles.container]}>
      <Text style={sharedStyles.title}>How To Play</Text>

      <FlatList
        style={styles.list}
        data={howToGuides}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => setSelectedGuide(item)}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
          </Pressable>
        )}
      />

      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      {selectedGuide && (
        <ImageSlideshowModal
          visible={!!selectedGuide}
          title={selectedGuide.title}
          images={selectedGuide.images}
          onClose={() => setSelectedGuide(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 70,
  },
  list: {
    marginTop: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "bold",
  },
  cardDescription: {
    color: colors.mutedText,
    marginTop: spacing.sm,
    lineHeight: 21,
  },
  backButton: {
    alignItems: "center",
    padding: spacing.lg,
  },
  backText: {
    color: colors.mutedText,
    fontWeight: "bold",
  },
});
