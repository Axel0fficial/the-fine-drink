import { promptPools } from "../data/promptPools";
import type { Challenge, GamePlayer } from "../types/game";

export type ResolvedChallenge = {
  challenge: Challenge;
  description: string;
};

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getEligibleChallengesForPlayer(
  challenges: Challenge[],
  player: GamePlayer | null,
): Challenge[] {
  return challenges.filter((challenge) => {
    if (!challenge.enabled) return false;

    const isDrinkingChallenge = challenge.categories.includes("drinking");

    if (player?.tag === "non_drinker" && isDrinkingChallenge) {
      return false;
    }

    return true;
  });
}

export function pickTwoChallengesForPlayer(
  challenges: Challenge[],
  player: GamePlayer | null,
): [Challenge | null, Challenge | null] {
  const eligibleChallenges = getEligibleChallengesForPlayer(challenges, player);

  if (eligibleChallenges.length === 0) return [null, null];
  if (eligibleChallenges.length === 1) return [eligibleChallenges[0], null];

  const shuffled = shuffleArray(eligibleChallenges);
  return [shuffled[0], shuffled[1]];
}
function getRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function resolvePoolPromptChallenge(challenge: Challenge): string {
  const poolRefs = challenge.logicConfig?.poolRefs as string[] | undefined;
  const template = challenge.logicConfig?.template as string | undefined;

  if (!poolRefs || poolRefs.length === 0 || !template) {
    return challenge.description || "Invalid prompt challenge.";
  }

  const selectedValues = poolRefs.map((poolRef) => {
    const pool = promptPools[poolRef];

    if (!pool || pool.length === 0) {
      return `[missing:${poolRef}]`;
    }

    return getRandomItem(pool);
  });

  let finalText = template;

  selectedValues.forEach((value, index) => {
    finalText = finalText.replaceAll(`{${index}}`, value);
  });

  return finalText;
}

export function resolveChallengeDescription(challenge: Challenge): string {
  if (!challenge.logicType || challenge.logicType === "none") {
    return challenge.description;
  }

  if (challenge.logicType === "range" && challenge.logicConfig) {
    const variable = challenge.logicConfig.variable ?? "x";
    const min = challenge.logicConfig.min ?? 1;
    const max = challenge.logicConfig.max ?? min;
    const rolledValue = Math.floor(Math.random() * (max - min + 1)) + min;

    return challenge.description.replace(`{${variable}}`, String(rolledValue));
  }

  if (challenge.logicType === "timer" && challenge.logicConfig?.seconds) {
    return challenge.description.replace(
      "{seconds}",
      String(challenge.logicConfig.seconds),
    );
  }

  if (
    challenge.logicType === "status_effect" &&
    challenge.logicConfig?.rounds
  ) {
    return challenge.description.replace(
      "{rounds}",
      String(challenge.logicConfig.rounds),
    );
  }

  if (challenge.logicType === "pool_prompt") {
    return resolvePoolPromptChallenge(challenge);
  }

  return challenge.description;
}

export function resolveChallenge(
  challenge: Challenge | null,
): ResolvedChallenge | null {
  if (!challenge) return null;

  return {
    challenge,
    description: resolveChallengeDescription(challenge),
  };
}
