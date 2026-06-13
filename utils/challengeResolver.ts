import { PoolKey, variablePools } from "@/data/pools";
import { Challenge, ChallengeVariable, Player, TeamColor } from "@/types/game";

type Language = "en" | "es";
type PoolValue = string | { en: string; es: string };

function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFromArray<T>(array: readonly T[]): T {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

function replaceVariable(text: string, key: string, value: string) {
  return text.replaceAll(`{${key}}`, value);
}

function localizePoolValue(value: PoolValue, language: Language) {
  return typeof value === "string" ? value : value[language];
}

function getPoolValues(pool: PoolKey): readonly PoolValue[] {
  return variablePools[pool] as readonly PoolValue[];
}

function pickFromPool(pool: PoolKey): PoolValue {
  return randomFromArray(getPoolValues(pool));
}

function pickFromAllowedPools(pools: PoolKey[]): PoolValue {
  const selectedPool = randomFromArray(pools);
  return pickFromPool(selectedPool);
}

function getActiveTeams(players: Player[]): TeamColor[] {
  const teams = players
    .map((player) => player.team)
    .filter((team) => team !== "none");

  return Array.from(new Set(teams));
}

function formatTeamName(team: TeamColor, language: Language) {
  const formattedTeam = `${team.charAt(0).toUpperCase()}${team.slice(1)}`;

  return language === "es"
    ? `Equipo ${formattedTeam}`
    : `${formattedTeam} Team`;
}

function pickMultipleFromSamePool(
  pool: PoolKey,
  amount: number,
  allowRepeats = false,
): PoolValue[] {
  const options = [...getPoolValues(pool)];
  const results: PoolValue[] = [];

  for (let i = 0; i < amount; i++) {
    if (options.length === 0) break;

    const randomIndex = Math.floor(Math.random() * options.length);
    const selected = options[randomIndex];

    results.push(selected);

    if (!allowRepeats) {
      options.splice(randomIndex, 1);
    }
  }

  return results;
}

export function resolveChallenge(
  challenge: Challenge,
  players: Player[] = [],
  currentPlayer?: Player,
): Challenge {
  const resolvedDescription = {
    ...challenge.description,
  };

  const playerName = currentPlayer?.name ?? "Player";

  resolvedDescription.en = replaceVariable(
    resolvedDescription.en,
    "player",
    playerName,
  );

  resolvedDescription.es = replaceVariable(
    resolvedDescription.es,
    "player",
    playerName,
  );

  challenge.variables?.forEach((variable: ChallengeVariable) => {
    if (variable.type === "number") {
      const value = randomNumber(variable.min, variable.max).toString();

      resolvedDescription.en = replaceVariable(
        resolvedDescription.en,
        variable.key,
        value,
      );

      resolvedDescription.es = replaceVariable(
        resolvedDescription.es,
        variable.key,
        value,
      );

      return;
    }

    if (variable.type === "pool") {
      const value = pickFromAllowedPools(variable.pools);

      resolvedDescription.en = replaceVariable(
        resolvedDescription.en,
        variable.key,
        localizePoolValue(value, "en"),
      );

      resolvedDescription.es = replaceVariable(
        resolvedDescription.es,
        variable.key,
        localizePoolValue(value, "es"),
      );

      return;
    }

    if (variable.type === "poolGroup") {
      const selectedPool = randomFromArray(variable.allowedPools);

      const values = pickMultipleFromSamePool(
        selectedPool,
        variable.keys.length,
        variable.allowRepeats ?? false,
      );

      variable.keys.forEach((key, index) => {
        const value = values[index];

        resolvedDescription.en = replaceVariable(
          resolvedDescription.en,
          key,
          value ? localizePoolValue(value, "en") : "???",
        );

        resolvedDescription.es = replaceVariable(
          resolvedDescription.es,
          key,
          value ? localizePoolValue(value, "es") : "???",
        );
      });

      return;
    }

    if (variable.type === "team") {
      const activeTeams = getActiveTeams(players);
      const selectedTeam =
        activeTeams.length > 0 ? randomFromArray(activeTeams) : "none";

      resolvedDescription.en = replaceVariable(
        resolvedDescription.en,
        variable.key,
        selectedTeam === "none"
          ? "No Team"
          : formatTeamName(selectedTeam, "en"),
      );

      resolvedDescription.es = replaceVariable(
        resolvedDescription.es,
        variable.key,
        selectedTeam === "none"
          ? "Sin equipo"
          : formatTeamName(selectedTeam, "es"),
      );
    }
  });

  return {
    ...challenge,
    description: resolvedDescription,
  };
}
