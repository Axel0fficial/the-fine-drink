import {
  Challenge,
  GameModifierId,
  Player,
  SessionDifficulty,
} from "@/types/game";
import { getDifficultyAdjustedWeight } from "@/utils/DifficultyUtils";
import { getChallengeOdds } from "@/utils/oddsUtils";

export function pickWeightedChallenge(
  challenges: Challenge[],
  player: Player,
  players: Player[],
  sessionDifficulty: SessionDifficulty,
  enabledGameModifiers: GameModifierId[],
) {
  if (challenges.length === 0) return null;

  const weightedChallenges = challenges.map((challenge) => ({
    challenge,
    weight:
      getChallengeOdds(challenge) *
      getDifficultyAdjustedWeight(
        challenge,
        player,
        players,
        sessionDifficulty,
        enabledGameModifiers,
      ),
  }));

  const totalWeight = weightedChallenges.reduce(
    (sum, item) => sum + item.weight,
    0,
  );

  let roll = Math.random() * totalWeight;

  for (const item of weightedChallenges) {
    roll -= item.weight;

    if (roll <= 0) {
      return item.challenge;
    }
  }

  return weightedChallenges[weightedChallenges.length - 1].challenge;
}
