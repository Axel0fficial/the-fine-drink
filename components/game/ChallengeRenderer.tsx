import { resolveFineDrinkStatuses } from "@/utils/fineDrinkResolver";
import { useMemo } from "react";

import { Challenge, PlayerStatus } from "@/types/game";
import ChallengeCard from "./ChallengeCard";
import FineDrinkMinigame from "./minigames/FineDrinkMinigame";
import QuickChoiceMinigame from "./minigames/QuickChoiceMiniGame";
import TimedButtonMinigame from "./minigames/TimedButtonMinigame";
import HorseRaceMinigame from "./minigames/UmaRaceMinigame";

type ChallengeRendererProps = {
  challenge: Challenge;
  currentPlayerName?: string;
  onToggleFavorite?: () => void;
  onFinishMinigame?: () => void;
  onApplyStatuses?: (statuses: PlayerStatus[]) => void;
  palette?: {
    background: string;
    primary: string;
    accent: string;
    text: string;
  };
};

export default function ChallengeRenderer({
  challenge,
  onToggleFavorite,
  onFinishMinigame,
  onApplyStatuses,
  palette,
  currentPlayerName,
}: ChallengeRendererProps) {
  const resolvedFineDrinkData = useMemo(() => {
    if (challenge.minigameType !== "fineDrink" || !challenge.fineDrinkData) {
      return null;
    }

    return resolveFineDrinkStatuses(challenge.fineDrinkData);
  }, [challenge.id]);

  if (challenge.type === "minigame") {
    if (challenge.minigameType === "quickChoice" && challenge.quickChoiceData) {
      return (
        <QuickChoiceMinigame
          data={challenge.quickChoiceData}
          playerName={currentPlayerName ?? "Player"}
          onFinish={onFinishMinigame ?? (() => {})}
        />
      );
    }

    if (challenge.minigameType === "horseRace") {
      return <HorseRaceMinigame onFinish={onFinishMinigame ?? (() => {})} />;
    }
    if (challenge.minigameType === "timedButton" && challenge.timedButtonData) {
      return (
        <TimedButtonMinigame
          data={challenge.timedButtonData}
          playerName={currentPlayerName ?? "Player"}
          onFinish={onFinishMinigame ?? (() => {})}
        />
      );
    }

    if (
      challenge.minigameType === "fineDrink" &&
      challenge.fineDrinkData &&
      resolvedFineDrinkData
    ) {
      return (
        <FineDrinkMinigame
          data={resolvedFineDrinkData}
          playerName={currentPlayerName ?? "Player"}
          onDecline={onFinishMinigame ?? (() => {})}
          onAccept={(statuses) => {
            onApplyStatuses?.(statuses);
          }}
        />
      );
    }
  }

  return (
    <ChallengeCard
      challenge={challenge}
      onToggleFavorite={onToggleFavorite}
      palette={palette}
    />
  );
}
