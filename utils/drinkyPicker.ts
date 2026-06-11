import { drinkyEvents } from "@/data/drinkyEvents";
import { Challenge, DrinkyEvent, Player } from "@/types/game";
import { getAvailableChallengesForPlayer } from "@/utils/challengeFilters";
import { pickWeightedChallenge } from "@/utils/challengePicker";
import { resolveChallenge } from "@/utils/challengeResolver";

function randomFromArray<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function canUseDrinkyEvent(
  event: DrinkyEvent,
  currentPlayer: Player,
  currentChallenge: Challenge,
) {
  if (currentPlayer.preferences.nonDrinker && event.tags.includes("drinking")) {
    return false;
  }

  if (
    currentPlayer.preferences.nonDrinker &&
    currentChallenge.tags.includes("drinking")
  ) {
    return false;
  }

  return true;
}

export function pickDrinkyEvent(
  currentPlayer: Player,
  currentChallenge: Challenge,
  allChallenges: Challenge[],
  allPlayers: Player[],
  teamsEnabled: boolean,
) {
  const availableEvents = drinkyEvents.filter((event) =>
    canUseDrinkyEvent(event, currentPlayer, currentChallenge),
  );

  if (availableEvents.length === 0) return null;

  const selectedEvent = randomFromArray(availableEvents);

  if (selectedEvent.type !== "secondChallenge") {
    return selectedEvent;
  }

  const availableExtraChallenges = getAvailableChallengesForPlayer(
    allChallenges,
    currentPlayer,
    { teamsEnabled },
  ).filter(
    (challenge) =>
      challenge.type !== "minigame" && challenge.id !== currentChallenge.id,
  );

  const extraChallenge = pickWeightedChallenge(
    availableExtraChallenges,
    currentPlayer,
    allPlayers,
    "normal",
    [],
  );
  if (!extraChallenge) return selectedEvent;

  return {
    ...selectedEvent,
    extraChallenge: resolveChallenge(extraChallenge, allPlayers),
  };
}
