import { text } from "@/locales/text";
import {
  GamePalette,
  colors,
  radius,
  sharedStyles,
  spacing,
} from "@/style/theme";
import {
  GameModifierId,
  GameModifierSettings,
  Player,
  PlayerStatus,
} from "@/types/game";
import { useLanguageStore } from "@/utils/languageStore";
import {
  playerIsInFirstPlace,
  playerIsInLastPlace,
} from "@/utils/playerRankingUtils";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type StatusBarProps = {
  statuses: PlayerStatus[];
  currentPlayer?: Player;
  players: Player[];
  enabledGameModifiers: GameModifierId[];
  palette: GamePalette;
  gameModifierSettings: GameModifierSettings;
};
export default function StatusBar({
  players,
  statuses,
  palette,
  currentPlayer,
  enabledGameModifiers,
  gameModifierSettings,
}: StatusBarProps) {
  const [visible, setVisible] = useState(false);
  const { language, toggleLanguage } = useLanguageStore();
  const t = text[language];
  const modifierStatuses: PlayerStatus[] = [];

  if (
    currentPlayer &&
    enabledGameModifiers.includes("kingOfTheHill") &&
    playerIsInFirstPlace(currentPlayer, players)
  ) {
    modifierStatuses.push({
      id: "modifier-king-of-the-hill",
      name: {
        en: "King of the Hill",
        es: "Rey de la Colina",
      },
      description: {
        en: "Session modifier: harder challenges while in first place.",
        es: "Modificador de sesión: desafíos más difíciles mientras vas en primer lugar.",
      },
      remainingRounds: 999,
      nature: "bad",
    });
  }

  if (
    currentPlayer &&
    enabledGameModifiers.includes("rocketRicky") &&
    playerIsInLastPlace(currentPlayer, players)
  ) {
    modifierStatuses.push({
      id: "modifier-rocket-ricky",
      name: {
        en: "Rocket Ricky",
        es: "Rocket Ricky",
      },
      description: {
        en: "Session modifier: easier challenges and +1 point while in last place.",
        es: "Modificador de sesión: desafíos más fáciles y +1 punto mientras vas en último lugar.",
      },
      remainingRounds: 999,
      nature: "good",
    });
  }
  if (
    currentPlayer &&
    enabledGameModifiers.includes("riggedForYou") &&
    gameModifierSettings.riggedForYouPlayerIds?.includes(currentPlayer.id)
  ) {
    modifierStatuses.push({
      id: "modifier-rigged-for-you",
      name: { en: "Rigged For You", es: "Arreglado contra ti" },
      description: {
        en: "Session modifier: this player is getting much harder challenges.",
        es: "Modificador de sesión: este jugador recibe desafios mucho mas dificiles",
      },
      remainingRounds: 999,
      nature: "bad",
    });
  }

  const displayedStatuses = [...modifierStatuses, ...statuses];

  return (
    <>
      <Pressable
        style={[styles.statusButton, { borderColor: palette.primary }]}
        onPress={() => setVisible(true)}
      >
        <Text style={[styles.statusButtonText, { color: palette.text }]}>
          {t.statuseslabel} ({displayedStatuses.length})
        </Text>
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={[styles.modalBox, { borderColor: palette.primary }]}>
            <Text style={[styles.title, { color: palette.text }]}>
              {t.currentStatuseslabel}
            </Text>

            <ScrollView style={styles.list}>
              {displayedStatuses.length === 0 ? (
                <Text style={styles.emptyText}>{t.noActiveStsLbl}</Text>
              ) : (
                displayedStatuses.map((status) => (
                  <View key={status.id} style={styles.statusCard}>
                    <Text style={styles.statusName}>
                      {status.name[language]}
                    </Text>

                    <Text style={styles.statusDescription}>
                      {status.description[language]}
                    </Text>

                    <Text style={styles.statusRounds}>
                      {t.remainingRoundsLbl} {status.remainingRounds}
                    </Text>
                  </View>
                ))
              )}
            </ScrollView>

            <Pressable
              style={[
                sharedStyles.primaryButton,
                { backgroundColor: palette.primary },
              ]}
              onPress={() => setVisible(false)}
            >
              <Text style={sharedStyles.buttonText}>{t.closeLbl}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  statusButton: {
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: radius.lg,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  statusButtonText: {
    color: colors.text,
    fontWeight: "bold",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  modalBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: spacing.lg,
    textAlign: "center",
  },
  list: {
    marginBottom: spacing.lg,
  },
  emptyText: {
    color: colors.mutedText,
    textAlign: "center",
    paddingVertical: spacing.xl,
  },
  statusCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  statusName: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  statusDescription: {
    color: colors.mutedText,
    marginTop: spacing.sm,
    fontSize: 15,
    lineHeight: 22,
  },
  statusRounds: {
    color: colors.primaryLight,
    marginTop: spacing.md,
    fontWeight: "bold",
  },
});
