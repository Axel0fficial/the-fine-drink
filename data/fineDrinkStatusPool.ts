import { PlayerStatus } from "@/types/game";

export const fineDrinkGoodStatuses: PlayerStatus[] = [
  {
    id: "royal-treatment",
    name: {
      en: "Royal Treatment",
      es: "Trato Real",
    },
    description: {
      en: "Once per turn, you may reduce your punishment by 1 sip.",
      es: "Una vez por turno, puedes reducir tu castigo en 1 trago.",
    },
    remainingRounds: 99,
    nature: "good",
  },
  {
    id: "second-chance",
    name: {
      en: "Second Chance",
      es: "Segunda Oportunidad",
    },
    description: {
      en: "Once, you may refuse a challenge without drinking.",
      es: "Una vez, puedes rechazar un reto sin beber.",
    },
    remainingRounds: 99,
    nature: "good",
  },
  {
    id: "gift-tax",
    name: {
      en: "Gift Tax",
      es: "Impuesto de Regalo",
    },
    description: {
      en: "Once per turn, you may give 1 sip to another player.",
      es: "Una vez por turno, puedes darle 1 trago a otro jugador.",
    },
    remainingRounds: 99,
    nature: "good",
  },
];

export const fineDrinkBadStatuses: PlayerStatus[] = [
  {
    id: "glass-jaw",
    name: {
      en: "Glass Jaw",
      es: "Mandíbula de Cristal",
    },
    description: {
      en: "Whenever someone gives you a punishment, add 1 extra sip.",
      es: "Cada vez que alguien te dé un castigo, añade 1 trago extra.",
    },
    remainingRounds: 99,
    nature: "bad",
  },
  {
    id: "honest-mouth",
    name: {
      en: "Honest Mouth",
      es: "Boca Honesta",
    },
    description: {
      en: "You cannot skip truth challenges without drinking.",
      es: "No puedes saltarte los retos de verdad sin beber.",
    },
    remainingRounds: 99,
    nature: "bad",
  },
  {
    id: "heavy-glass",
    name: {
      en: "Heavy Glass",
      es: "Vaso Pesado",
    },
    description: {
      en: "Whenever you drink, add 1 extra sip.",
      es: "Cada vez que bebas, añade 1 trago extra.",
    },
    remainingRounds: 99,
    nature: "bad",
  },
];
