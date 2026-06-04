import { PoolKey, variablePools } from "@/data/pools";
import { Challenge, ChallengeVariable, Player, TeamColor } from "@/types/game";

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

function pickFromPool(pool: PoolKey) {
  return randomFromArray(variablePools[pool]);
}

function pickFromAllowedPools(pools: PoolKey[]) {
  const selectedPool = randomFromArray(pools);
  return pickFromPool(selectedPool);
}
function getActiveTeams(players: Player[]): TeamColor[] {
  const teams = players
    .map((player) => player.team)
    .filter((team) => team !== "none");

  return Array.from(new Set(teams));
}

function formatTeamName(team: TeamColor) {
  return `${team.charAt(0).toUpperCase()}${team.slice(1)} Team`;
}

function pickMultipleFromSamePool(
  pool: PoolKey,
  amount: number,
  allowRepeats = false,
) {
  const options = [...variablePools[pool]];

  const results: string[] = [];

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
): Challenge {
  let resolvedDescription = challenge.description;

  challenge.variables?.forEach((variable: ChallengeVariable) => {
    if (variable.type === "number") {
      const value = randomNumber(variable.min, variable.max).toString();
      resolvedDescription = replaceVariable(
        resolvedDescription,
        variable.key,
        value,
      );
      return;
    }

    if (variable.type === "pool") {
      const value = pickFromAllowedPools(variable.pools);
      resolvedDescription = replaceVariable(
        resolvedDescription,
        variable.key,
        value,
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
        resolvedDescription = replaceVariable(
          resolvedDescription,
          key,
          values[index] ?? "???",
        );
      });

      return;
    }

    if (variable.type === "team") {
      const activeTeams = getActiveTeams(players);
      const selectedTeam =
        activeTeams.length > 0 ? randomFromArray(activeTeams) : "none";

      resolvedDescription = replaceVariable(
        resolvedDescription,
        variable.key,
        selectedTeam === "none" ? "No Team" : formatTeamName(selectedTeam),
      );
    }
  });

  return {
    ...challenge,
    description: resolvedDescription,
  };
}
