import { useState } from "react";
import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, sharedStyles, spacing } from "@/style/theme";

type ImageSlideshowModalProps = {
  visible: boolean;
  title: string;
  images: any[];
  onClose: () => void;
};

export default function ImageSlideshowModal({
  visible,
  title,
  images,
  onClose,
}: ImageSlideshowModalProps) {
  const [index, setIndex] = useState(0);

  const image = images[index];
  const isFirst = index === 0;
  const isLast = index === images.length - 1;

  function closeModal() {
    setIndex(0);
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>{title}</Text>

          <Text style={styles.counter}>
            {index + 1} / {images.length}
          </Text>

          <Image source={image} style={styles.image} resizeMode="contain" />

          <View style={styles.actions}>
            <Pressable
              style={[styles.secondaryButton, isFirst && styles.disabledButton]}
              disabled={isFirst}
              onPress={() => setIndex((current) => Math.max(current - 1, 0))}
            >
              <Text style={styles.secondaryText}>Back</Text>
            </Pressable>

            <Pressable
              style={styles.primaryButton}
              onPress={() => {
                if (isLast) {
                  closeModal();
                  return;
                }

                setIndex((current) => current + 1);
              }}
            >
              <Text style={sharedStyles.buttonText}>
                {isLast ? "Done" : "Next"}
              </Text>
            </Pressable>
          </View>

          <Pressable style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.82)",
    justifyContent: "center",
    padding: spacing.lg,
  },
  modalBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderColor: colors.primary,
    borderWidth: 1,
    padding: spacing.lg,
    maxHeight: "92%",
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  counter: {
    color: colors.mutedText,
    textAlign: "center",
    marginBottom: spacing.md,
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 420,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: radius.lg,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: "center",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: "center",
  },
  secondaryText: {
    color: colors.text,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.35,
  },
  closeButton: {
    alignItems: "center",
    paddingTop: spacing.md,
  },
  closeText: {
    color: colors.mutedText,
    fontWeight: "bold",
  },
});
