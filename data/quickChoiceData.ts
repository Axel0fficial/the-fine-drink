import { QuickChoiceQuestion } from "@/types/game";

export const quickChoiceQuestions: QuickChoiceQuestion[] = [
  {
    word: "Kahlua",
    correctOptions: ["Liqueur"],
  },
  {
    word: "Toyota",
    correctOptions: ["Car brand"],
  },
  {
    word: "Baileys",
    correctOptions: ["Liqueur"],
  },
  {
    word: "Socrates",
    correctOptions: ["Greek philosopher"],
  },
  {
    word: "Campari",
    correctOptions: ["Liqueur"],
  },
  {
    word: "Hornet",
    correctOptions: ["Insect", "Videogame character", "Fighter jet"],
  },
];

export const quickChoiceWrongOptionPool = [
  "Liqueur",
  "Car brand",
  "Greek philosopher",
  "Italian shoe brand",
  "Insect",
  "Videogame character",
  "Fighter jet",
  "Anime character",
  "Board game",
  "Cocktail",
  "Dog breed",
  "Movie villain",
];

export const quickChoiceRewards = [
  "Give 2 sips.",
  "Skip your next punishment.",
  "Choose someone to answer a truth question.",
];

export const quickChoicePunishments = [
  "Take 2 sips.",
  "Do the next challenge twice.",
  "Let the group give you a punishment.",
];
