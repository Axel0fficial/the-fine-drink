import { text } from "@/locales/text";
import { resolveFineDrinkStatuses } from "@/utils/fineDrinkResolver";
import { useLanguageStore } from "@/utils/languageStore";
import { useMemo } from "react";
import ChallengeCard from "./ChallengeCard";
import FineDrinkMinigame from "./minigames/FineDrinkMinigame";
import QuickChoiceMinigame from "./minigames/QuickChoiceMiniGame";

import { Challenge, PlayerStatus } from "@/types/game";

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
  const { language, toggleLanguage } = useLanguageStore();
  const t = text[language];
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
    if (challenge.minigameType === "fineDrink" && challenge.fineDrinkData) {
      const resolvedFineDrinkData = useMemo(
        () => resolveFineDrinkStatuses(challenge.fineDrinkData!),
        [challenge.id],
      );

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
