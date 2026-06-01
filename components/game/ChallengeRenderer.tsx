import { Challenge } from "@/types/game";
import ChallengeCard from "./ChallengeCard";

type ChallengeRendererProps = {
  challenge: Challenge;
};

export default function ChallengeRenderer({
  challenge,
}: ChallengeRendererProps) {
  switch (challenge.type) {
    case "minigame":
      return <ChallengeCard challenge={challenge} />;

    case "status":
      return <ChallengeCard challenge={challenge} />;

    case "custom":
      return <ChallengeCard challenge={challenge} />;

    case "simple":
    default:
      return <ChallengeCard challenge={challenge} />;
  }
}
