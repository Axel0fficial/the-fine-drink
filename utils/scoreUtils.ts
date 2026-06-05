import { Challenge } from "@/types/game";

export function getChallengeScore(challenge: Challenge): number {
  switch (challenge.difficulty) {
    case "easy":
      return 1;
    case "normal":
      return 2;
    case "hard":
      return 3;
    case "brutal":
      return 4;
    default:
      return 0;
  }
}
