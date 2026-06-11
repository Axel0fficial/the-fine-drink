import {
  Challenge,
  Difficulty,
  GameModifierId,
  Player,
  SessionDifficulty,
} from "@/types/game";

const difficultyRank: Record<Difficulty, number> = {
  easy: 1,
  normal: 2,
  hard: 3,
  brutal: 4,
};

const sessionDifficultyTarget: Record<SessionDifficulty, number> = {
  chill: 1,
  normal: 2,
  spicy: 3,
  chaos: 4,
};

function getHighestScore(players: Player[]) {
  return Math.max(...players.map((player) => player.score));
}

function getLowestScore(players: Player[]) {
  return Math.min(...players.map((player) => player.score));
}

function playerIsInFirstPlace(player: Player, players: Player[]) {
  if (players.length < 2) return false;
  return player.score === getHighestScore(players);
}

function playerIsInLastPlace(player: Player, players: Player[]) {
  if (players.length < 2) return false;
  return player.score === getLowestScore(players);
}

export function getPlayerDifficultyModifier(player: Player) {
  return player.statuses.reduce(
    (total, status) => total + (status.difficultyModifier ?? 0),
    0,
  );
}

export function getGameModifierDifficultyModifier(
  player: Player,
  players: Player[],
  enabledGameModifiers: GameModifierId[],
) {
  let modifier = 0;

  if (
    enabledGameModifiers.includes("kingOfTheHill") &&
    playerIsInFirstPlace(player, players)
  ) {
    modifier += 1;
  }

  if (
    enabledGameModifiers.includes("rocketRicky") &&
    playerIsInLastPlace(player, players)
  ) {
    modifier -= 1;
  }

  return modifier;
}

export function getDifficultyAdjustedWeight(
  challenge: Challenge,
  player: Player,
  players: Player[],
  sessionDifficulty: SessionDifficulty,
  enabledGameModifiers: GameModifierId[],
) {
  const rawTarget =
    sessionDifficultyTarget[sessionDifficulty] +
    getPlayerDifficultyModifier(player) +
    getGameModifierDifficultyModifier(player, players, enabledGameModifiers);

  const target = Math.max(1, Math.min(rawTarget, 4));

  const challengeLevel = difficultyRank[challenge.difficulty];
  const distance = Math.abs(challengeLevel - target);

  if (distance === 0) return 1.5;
  if (distance === 1) return 1;
  if (distance === 2) return 0.6;

  return 0.3;
}
