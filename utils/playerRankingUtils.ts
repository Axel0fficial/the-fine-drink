import { Player } from "@/types/game";

export function getHighestScore(players: Player[]) {
  return Math.max(...players.map((player) => player.score));
}

export function getLowestScore(players: Player[]) {
  return Math.min(...players.map((player) => player.score));
}

export function playerIsInFirstPlace(player: Player, players: Player[]) {
  if (players.length < 2) return false;
  return player.score === getHighestScore(players);
}

export function playerIsInLastPlace(player: Player, players: Player[]) {
  if (players.length < 2) return false;
  return player.score === getLowestScore(players);
}
