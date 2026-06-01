import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../style/theme";
import { Player } from "../../types/game";

type GameHeaderProps = {
  turn: number;
  currentPlayer?: Player;
};

export default function GameHeader({ turn, currentPlayer }: GameHeaderProps) {
  return (
    <View>
      <Text style={styles.round}>Round {turn + 1}</Text>
      <Text style={styles.player}>{currentPlayer?.name}'s turn</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  round: {
    color: colors.mutedText,
    textAlign: "right",
    fontSize: 16,
  },
  player: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 24,
  },
});
