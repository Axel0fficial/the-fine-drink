import { promptPools } from "../data/promptPools";
import type { MatchStatus } from "../minigames/types";
import type {
  Challenge,
  GamePlayer,
  PlayerTag,
  PromptPoolItem,
} from "../types/game";

export type ResolvedChallenge = {
  challenge: Challenge;
  description: string;
  generatedStatuses?: MatchStatus[];
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
function isAudienceAllowedForPlayer(
  audience: "all" | "drinkers_only" | "non_drinkers_only",
  playerTag: PlayerTag,
): boolean {
  if (audience === "all") return true;
  if (audience === "drinkers_only") return playerTag !== "non_drinker";
  if (audience === "non_drinkers_only") return playerTag === "non_drinker";
  return true;
}

function getCompatiblePromptPoolItems(
  poolItems: PromptPoolItem[],
  player: GamePlayer | null,
): PromptPoolItem[] {
  const playerTag = player?.tag ?? "none";

  return poolItems.filter((item) =>
    isAudienceAllowedForPlayer(item.audience, playerTag),
  );
}
function resolveStatusEffectChallenge(
  challenge: Challenge,
  player: GamePlayer | null,
): { description: string; generatedStatuses: MatchStatus[] } | null {
  const config = challenge.logicConfig;
  if (!config) return null;

  const rounds =
    typeof config.rounds === "number" ? config.rounds : 1;

  let description = challenge.description;
  let rolledValue: number | undefined;

  if (
    typeof config.variable === "string" &&
    typeof config.min === "number" &&
    typeof config.max === "number"
  ) {
    rolledValue =
      Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;

    description = description.replaceAll(
      `{${config.variable}}`,
      String(rolledValue),
    );
  }

  description = description.replaceAll("{rounds}", String(rounds));

  const generatedStatus: MatchStatus = {
    id: `status_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    scope: config.scope === "global" ? "global" : "player",
    playerId: config.scope === "player" ? player?.id : undefined,
    playerName: config.scope === "player" ? player?.name : undefined,
    text: description,
    tone: config.tone === "good" ? "good" : "bad",
    sourceChallengeId: challenge.id,
    remainingRounds: rounds,
    effectKey: typeof config.effect === "string" ? config.effect : undefined,
    effectValue: rolledValue,
  };

  return {
    description,
    generatedStatuses: [generatedStatus],
  };
}
function resolvePoolPromptChallenge(
  challenge: Challenge,
  player: GamePlayer | null,
): string | null {
  const poolRefs = challenge.logicConfig?.poolRefs as string[] | undefined;
  const template = challenge.logicConfig?.template as string | undefined;

  if (!poolRefs || poolRefs.length === 0 || !template) {
    return challenge.description || "Invalid prompt challenge.";
  }

  const selectedValues: string[] = [];

  for (const poolRef of poolRefs) {
    const pool = promptPools[poolRef];

    if (!pool || pool.length === 0) {
      return null;
    }

    const compatibleItems = getCompatiblePromptPoolItems(pool, player);

    if (compatibleItems.length === 0) {
      return null;
    }

    selectedValues.push(getRandomItem(compatibleItems).text);
  }

  let finalText = template;

  selectedValues.forEach((value, index) => {
    finalText = finalText.replaceAll(`{${index}}`, value);
  });

  return finalText;
}


export function resolveChallengeDescription(
  challenge: Challenge,
  player: GamePlayer | null,
): string | null {
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

  if (challenge.logicType === "status_effect") {
    const resolved = resolveStatusEffectChallenge(challenge, player);
    return resolved?.description ?? challenge.description;
  }

  if (challenge.logicType === "pool_prompt") {
    return resolvePoolPromptChallenge(challenge, player);
  }

  return challenge.description;
}

export function resolveChallenge(
  challenge: Challenge | null,
  player: GamePlayer | null,
): ResolvedChallenge | null {
  if (!challenge) return null;

  if (challenge.logicType === "status_effect") {
    const resolved = resolveStatusEffectChallenge(challenge, player);
    if (!resolved) return null;

    return {
      challenge,
      description: resolved.description,
      generatedStatuses: resolved.generatedStatuses,
    };
  }

  const description = resolveChallengeDescription(challenge, player);

  if (!description) return null;

  return {
    challenge,
    description,
  };
}