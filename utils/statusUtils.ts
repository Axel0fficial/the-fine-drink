import { Player } from "@/types/game";

export function tickPlayerStatuses(player: Player): Player {
  return {
    ...player,
    statuses: player.statuses
      .map((status) => ({
        ...status,
        remainingRounds: status.remainingRounds - 1,
      }))
      .filter((status) => status.remainingRounds > 0),
  };
}
