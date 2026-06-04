import { Challenge, Player } from "@/types/game";

type ChallengeFilterOptions = {
  teamsEnabled: boolean;
};

export function canPlayerReceiveChallenge(
  challenge: Challenge,
  player: Player,
  options: ChallengeFilterOptions,
) {
  if (player.preferences.nonDrinker && challenge.tags.includes("drinking")) {
    return false;
  }

  if (!options.teamsEnabled && challenge.tags.includes("teams")) {
    return false;
  }

  if (challenge.tags.includes("teams") && player.team === "none") {
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
