import { text } from "@/locales/text";
import { useLanguageStore } from "@/utils/languageStore";
import { StyleSheet, Text, View } from "react-native";

import { GamePalette } from "@/style/theme";
import { Player } from "@/types/game";

type GameHeaderProps = {
  round: number;
  currentPlayer?: Player;
  palette: GamePalette;
  rightAction?: React.ReactNode;
  statusAction?: React.ReactNode;
};

export default function GameHeader({
  round,
  currentPlayer,
  palette,
  rightAction,
  statusAction,
}: GameHeaderProps) {
  const { language, toggleLanguage } = useLanguageStore();
  const t = text[language];
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={[styles.player, { color: palette.text }]}>
          {currentPlayer?.name}{t.playersturn}
        </Text>

        {rightAction}
      </View>

      <View style={styles.bottomRow}>
        <Text style={[styles.round, { color: palette.accent }]}>
          {t.roundLbl} {round}
        </Text>

        {statusAction}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  player: {
    fontSize: 28,
    fontWeight: "bold",
    flex: 1,
    paddingRight: 12,
  },
  round: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
