import {
    fineDrinkBadStatuses,
    fineDrinkGoodStatuses,
} from "@/data/fineDrinkStatusPool";

import { FineDrinkData, PlayerStatus } from "@/types/game";

function randomFromArray<T>(array: readonly T[]): T {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

function cloneStatus(status: PlayerStatus): PlayerStatus {
  return {
    ...status,
    id: `${status.id}-${Date.now()}-${Math.random()}`,
  };
}

export function resolveFineDrinkStatuses(data: FineDrinkData) {
  let offerNature = data.offerNature;

  if (offerNature === "random") {
    offerNature = Math.random() < 0.5 ? "good" : "bad";
  }

  const oppositeNature = offerNature === "good" ? "bad" : "good";

  const offerPool =
    offerNature === "good" ? fineDrinkGoodStatuses : fineDrinkBadStatuses;

  const hiddenPool =
    oppositeNature === "good" ? fineDrinkGoodStatuses : fineDrinkBadStatuses;

  const offerStatus = cloneStatus(randomFromArray(offerPool));
  const hiddenStatus = cloneStatus(randomFromArray(hiddenPool));

  return {
    offerStatus,
    hiddenStatus,
  };
}
