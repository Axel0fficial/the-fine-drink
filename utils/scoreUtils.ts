import { Challenge, GameModifierId, Player } from "@/types/game";

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

function getLowestScore(players: Player[]) {
  return Math.min(...players.map((player) => player.score));
}

function playerIsInLastPlace(player: Player, players: Player[]) {
  if (players.length < 2) return false;

  return player.score === getLowestScore(players);
}

export function getScoreWithModifiers(
  challenge: Challenge,
  player: Player,
  players: Player[],
  enabledGameModifiers: GameModifierId[],
) {
  let score = getChallengeScore(challenge);

  if (
    enabledGameModifiers.includes("rocketRicky") &&
    playerIsInLastPlace(player, players)
  ) {
    score += 1;
  }

  return score;
}
