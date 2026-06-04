import { Challenge } from "@/types/game";
import { getChallengeOdds } from "@/utils/oddsUtils";

export function pickWeightedChallenge(challenges: Challenge[]) {
  if (challenges.length === 0) return null;

  const weightedChallenges = challenges.map((challenge) => ({
    challenge,
    weight: getChallengeOdds(challenge),
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
