import { Challenge, Player } from "@/types/game";

type ChallengeFilterOptions = {
  teamsEnabled: boolean;
};

export function canPlayerReceiveChallenge(
  challenge: Challenge,
  player: Player,
  options: ChallengeFilterOptions,
) {
  const playerIsNonDrinker = player.preferences?.nonDrinker ?? false;
  const playerTeam = player.team ?? "none";
  const challengeTags = challenge.tags ?? [];

  if (playerIsNonDrinker && challengeTags.includes("drinking")) {
    return false;
  }

  if (!options.teamsEnabled && challengeTags.includes("teams")) {
    return false;
  }

  if (challengeTags.includes("teams") && playerTeam === "none") {
    return false;
  }

  return true;
}

export function getAvailableChallengesForPlayer(
  challenges: Challenge[],
  player: Player,
  options: ChallengeFilterOptions,
) {
  return challenges.filter((challenge) =>
    canPlayerReceiveChallenge(challenge, player, options),
  );
}
