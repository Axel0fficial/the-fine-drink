import { Player } from "@/types/game";

export function updatePlayerStatuses(player: Player): Player {
  const updatedStatuses = player.statuses
    .map((status) => ({
      ...status,
      remainingRounds: status.remainingRounds - 1,
    }))
    .filter((status) => status.remainingRounds > 0);

  return {
    ...player,
    statuses: updatedStatuses,
  };
}
