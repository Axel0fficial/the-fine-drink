import { resolveFineDrinkStatuses } from "@/utils/fineDrinkResolver";
import { useMemo } from "react";
import ChallengeCard from "./ChallengeCard";
import FineDrinkMinigame from "./minigames/FineDrinkMinigame";

import { Challenge, PlayerStatus } from "@/types/game";

type ChallengeRendererProps = {
  challenge: Challenge;
  onFinishMinigame?: () => void;
  onApplyStatuses?: (statuses: PlayerStatus[]) => void;
};

export default function ChallengeRenderer({
  challenge,
  onFinishMinigame,
  onApplyStatuses,
}: ChallengeRendererProps) {
  if (challenge.type === "minigame") {
    if (challenge.minigameType === "fineDrink" && challenge.fineDrinkData) {
      const resolvedFineDrinkData = useMemo(
        () => resolveFineDrinkStatuses(challenge.fineDrinkData!),
        [challenge.id],
      );

      return (
        <FineDrinkMinigame
          data={resolvedFineDrinkData}
          onDecline={onFinishMinigame ?? (() => {})}
          onAccept={(statuses) => {
            onApplyStatuses?.(statuses);
            onFinishMinigame?.();
          }}
        />
      );
    }
  }

  return <ChallengeCard challenge={challenge} />;
}
