import { GameModifier } from "@/types/game";

export const gameModifiers: GameModifier[] = [
  {
    id: "kingOfTheHill",
    name: "King of the Hill",
    description: "The player in first place gets harder challenges.",
    enabled: false,
  },
  {
    id: "rocketRicky",
    name: "Rocket Ricky",
    description:
      "The player in last place gets easier challenges and bonus points.",
    enabled: false,
  },
];
