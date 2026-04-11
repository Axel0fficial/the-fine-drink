import { promptPools } from "../data/promptPools";
import type { MatchStatus } from "../minigames/types";
import type {
  Challenge,
  GamePlayer,
  PlayerTag,
  PromptPoolItem,
  SessionModifier,
} from "../types/game";

export type ResolvedChallenge = {
  challenge: Challenge;
  description: string;
  generatedStatuses?: MatchStatus[];
};

type Difficulty = "easy" | "normal" | "hard" | "brutal";

function applyDifficultyLogic(
  logicConfig: Record<string, any> | undefined,
  difficultyLogic: Record<string, any> | undefined,
  selectedDifficulty: Difficulty,
) {
  if (!logicConfig) return {};

  const override = difficultyLogic?.[selectedDifficulty];

  if (!override) return logicConfig;

  return {
    ...logicConfig,
    ...override,
  };
}

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

function getPrankModifierForPlayer(
  modifiers: SessionModifier[],
  player: GamePlayer | null,
): SessionModifier | null {
  if (!player) return null;

  return (
    modifiers.find(
      (modifier) =>
        modifier.enabled &&
        modifier.logicConfig?.effect === "prank_mode" &&
        modifier.logicConfig?.targetPlayerId === player.id,
    ) ?? null
  );
}

function getLeader(players: GamePlayer[]): GamePlayer | null {
  if (players.length === 0) return null;

  return players.reduce((prev, curr) =>
    curr.score > prev.score ? curr : prev,
  );
}

function getLastPlace(players: GamePlayer[]): GamePlayer | null {
  if (players.length === 0) return null;

  return players.reduce((prev, curr) =>
    curr.score < prev.score ? curr : prev,
  );
}

function getDifficultyWeight(
  challengeDifficulty: Difficulty,
  selectedDifficulty: Difficulty,
): number {
  const weights: Record<Difficulty, Record<Difficulty, number>> = {
    easy: { easy: 4, normal: 3, hard: 1, brutal: 0.5 },
    normal: { easy: 2, normal: 3, hard: 2, brutal: 1 },
    hard: { easy: 1, normal: 2, hard: 3, brutal: 2 },
    brutal: { easy: 0.5, normal: 1, hard: 3, brutal: 4 },
  };

  return weights[selectedDifficulty][challengeDifficulty];
}

function getEffectiveDifficulty(
  challenge: Challenge,
  selectedDifficulty: Difficulty,
): Difficulty {
  if (!challenge.difficultyLogic) {
    return challenge.difficulty as Difficulty;
  }

  if (selectedDifficulty === "brutal" && challenge.difficultyLogic.brutal) {
    return "brutal";
  }

  if (selectedDifficulty === "hard" && challenge.difficultyLogic.hard) {
    return "hard";
  }

  if (selectedDifficulty === "normal" && challenge.difficultyLogic.normal) {
    return "normal";
  }

  if (selectedDifficulty === "easy" && challenge.difficultyLogic.easy) {
    return "easy";
  }

  return challenge.difficulty as Difficulty;
}

export function pickTwoChallengesForPlayer(
  challenges: Challenge[],
  player: GamePlayer | null,
  modifiers: SessionModifier[] = [],
  players: GamePlayer[] = [],
  selectedDifficulty: Difficulty = "normal",
): [Challenge | null, Challenge | null] {
  const eligibleChallenges = getEligibleChallengesForPlayer(challenges, player);

  if (eligibleChallenges.length === 0) return [null, null];
  if (eligibleChallenges.length === 1) return [eligibleChallenges[0], null];

  const prankModifier = getPrankModifierForPlayer(modifiers, player);

  if (prankModifier) {
    const intensity = Number(prankModifier.logicConfig?.intensity ?? 2);

    const brutalPool = eligibleChallenges.filter(
      (challenge) =>
        getEffectiveDifficulty(challenge, selectedDifficulty) === "brutal",
    );

    const hardPool = eligibleChallenges.filter(
      (challenge) =>
        getEffectiveDifficulty(challenge, selectedDifficulty) === "hard",
    );

    const normalPool = eligibleChallenges.filter(
      (challenge) =>
        getEffectiveDifficulty(challenge, selectedDifficulty) === "normal",
    );

    let preferredPool: Challenge[] = [];

    if (intensity >= 3) {
      preferredPool = [...brutalPool, ...hardPool];
    } else if (intensity === 2) {
      preferredPool = [...hardPool, ...brutalPool];
    } else {
      preferredPool = [...hardPool, ...normalPool];
    }

    const uniquePreferred = Array.from(
      new Map(
        preferredPool.map((challenge) => [challenge.id, challenge]),
      ).values(),
    );

    if (uniquePreferred.length >= 2) {
      const shuffled = shuffleArray(uniquePreferred);
      return [shuffled[0], shuffled[1]];
    }

    if (uniquePreferred.length === 1) {
      const rest = eligibleChallenges.filter(
        (challenge) => challenge.id !== uniquePreferred[0].id,
      );
      const shuffledRest = shuffleArray(rest);
      return [uniquePreferred[0], shuffledRest[0] ?? null];
    }
  }

  const downWithKingActive = modifiers.some(
    (m) => m.enabled && m.id === "mod_down_with_the_king",
  );

  const lastPlaceBoostActive = modifiers.some(
    (m) => m.enabled && m.id === "mod_last_place_boost",
  );

  const leader = getLeader(players);
  const lastPlace = getLastPlace(players);

  if (downWithKingActive && player && leader && player.id === leader.id) {
    const hardPool = eligibleChallenges.filter((c) => {
      const effectiveDifficulty = getEffectiveDifficulty(c, selectedDifficulty);
      return effectiveDifficulty === "hard" || effectiveDifficulty === "brutal";
    });

    if (hardPool.length >= 2) {
      const shuffled = shuffleArray(hardPool);
      return [shuffled[0], shuffled[1]];
    }
  }

  if (
    lastPlaceBoostActive &&
    player &&
    lastPlace &&
    player.id === lastPlace.id
  ) {
    const easyPool = eligibleChallenges.filter((c) => {
      const effectiveDifficulty = getEffectiveDifficulty(c, selectedDifficulty);
      return effectiveDifficulty === "easy" || effectiveDifficulty === "normal";
    });

    if (easyPool.length >= 2) {
      const shuffled = shuffleArray(easyPool);
      return [shuffled[0], shuffled[1]];
    }
  }

  const weightedPool: Challenge[] = [];

  for (const challenge of eligibleChallenges) {
    const effectiveDifficulty = getEffectiveDifficulty(
      challenge,
      selectedDifficulty,
    );

    const weight = getDifficultyWeight(effectiveDifficulty, selectedDifficulty);

    const copies = Math.max(1, Math.floor(weight));

    for (let i = 0; i < copies; i++) {
      weightedPool.push(challenge);
    }
  }

  const shuffled = shuffleArray(weightedPool);

  return [shuffled[0] ?? null, shuffled[1] ?? null];
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
  selectedDifficulty: Difficulty,
): { description: string; generatedStatuses: MatchStatus[] } | null {
  const config = applyDifficultyLogic(
    challenge.logicConfig,
    challenge.difficultyLogic,
    selectedDifficulty,
  );

  if (!config) return null;

  const rounds = typeof config.rounds === "number" ? config.rounds : 1;

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
  selectedDifficulty: Difficulty,
): string | null {
  if (!challenge.logicType || challenge.logicType === "none") {
    return challenge.description;
  }

  if (challenge.logicType === "range" && challenge.logicConfig) {
    const config = applyDifficultyLogic(
      challenge.logicConfig,
      challenge.difficultyLogic,
      selectedDifficulty,
    );

    const variable = config.variable ?? "x";
    const min = config.min ?? 1;
    const max = config.max ?? min;
    const rolledValue = Math.floor(Math.random() * (max - min + 1)) + min;

    return challenge.description.replaceAll(
      `{${variable}}`,
      String(rolledValue),
    );
  }

  if (challenge.logicType === "timer" && challenge.logicConfig) {
    const config = applyDifficultyLogic(
      challenge.logicConfig,
      challenge.difficultyLogic,
      selectedDifficulty,
    );

    if (config.seconds) {
      return challenge.description.replaceAll(
        "{seconds}",
        String(config.seconds),
      );
    }
  }

  if (challenge.logicType === "status_effect") {
    const resolved = resolveStatusEffectChallenge(
      challenge,
      player,
      selectedDifficulty,
    );
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
  selectedDifficulty: Difficulty,
): ResolvedChallenge | null {
  if (!challenge) return null;

  if (challenge.logicType === "status_effect") {
    const resolved = resolveStatusEffectChallenge(
      challenge,
      player,
      selectedDifficulty,
    );
    if (!resolved) return null;

    return {
      challenge,
      description: resolved.description,
      generatedStatuses: resolved.generatedStatuses,
    };
  }

  const description = resolveChallengeDescription(
    challenge,
    player,
    selectedDifficulty,
  );

  if (!description) return null;

  return {
    challenge,
    description,
  };
}
