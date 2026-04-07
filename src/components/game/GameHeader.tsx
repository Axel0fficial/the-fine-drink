import React from "react";
import { Pressable, Text, View } from "react-native";
import { gameSharedStyles as styles } from "../style/gameSharedStyles";

type Props = {
  currentRound: number;
  turnInRound: number;
  totalPlayers: number;
  onFinish: () => void;
};

export default function GameHeader({
  currentRound,
  turnInRound,
  totalPlayers,
  onFinish,
}: Props) {
  return (
    <View style={styles.topBar}>
      <View>
        <Text style={styles.title}>Round {currentRound}</Text>
        <Text style={styles.turnText}>
          Player {turnInRound} of {totalPlayers}
        </Text>
      </View>

      <Pressable style={styles.finishButton} onPress={onFinish}>
        <Text style={styles.finishButtonText}>Finish</Text>
      </Pressable>
    </View>
  );
}