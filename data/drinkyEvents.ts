import { DrinkyEvent } from "@/types/game";

const passout = require("@/assets/images/passedout.png");
const gifts = require("@/assets/images/gifts.png");
const ignores = require("@/assets/images/ignores.png");
const looms = require("@/assets/images/looms.png");
const leans = require("@/assets/images/leans.png");
export const drinkyEvents: DrinkyEvent[] = [
  {
    id: "nonsense-1",
    type: "nonsense",
    text: {
      en: "Я пьяна (YA tak p'yan)",
      es: "Я пьяна (YA tak p'yan)",
    },
    tags: ["nonDrinkerSafe"],
    image: passout,
  },
  {
    id: "joke-1",
    type: "joke",
    text: {
      en: "Statistically speaking, someone here is about to make a terrible choice.",
      es: "Estadísticamente hablando, alguien aquí está a punto de tomar una decisión terrible.",
    },
    tags: ["nonDrinkerSafe"],
    image: looms,
  },
  {
    id: "modifier-1",
    type: "challengeModifier",
    text: {
      en: "Double the challenge. If you succeed, choose another player to do the original version.",
      es: "Duplica el desafío. Si lo completas, elige a otro jugador para que haga la versión original.",
    },
    tags: ["nonDrinkerSafe"],
    image: leans,
  },
  {
    id: "push-1",
    type: "pushChallenge",
    text: {
      en: "You may push this challenge to another player. But they get to complain dramatically.",
      es: "Eres libre de pasar este desafio a otro jugador y como agradecimiento tienen derecho a quejarse",
    },
    tags: ["nonDrinkerSafe"],
    image: leans,
  },
  {
    id: "drink-modifier-1",
    type: "challengeModifier",
    text: {
      en: "Double the punishment. I believe in you. Badly.",
      es: "Duplica le castigo, Tengo fe de que puedes aguantar",
    },
    tags: ["drinking"],
    image: passout,
  },

  {
    id: "second-challenge-1",
    type: "secondChallenge",
    text: {
      en: "I brought you another challenge because I care. \nOr because I’m bored.",
      es: "Traigo otro desafio porque me preocupo, \nO porque estoy aburrida ",
    },
    tags: ["nonDrinkerSafe"],
    image: ignores,
  },
  {
    id: "status-gift-1",
    type: "grantStatus",
    text: {
      en: "Congratulations, I have gifted you a suspicious status.",
      es: "Felicitaciones, He traido una condicion de regalo ",
    },
    tags: ["nonDrinkerSafe"],
    image: gifts,
    statusEffect: {
      id: "drinky-spotlight",
      name: "Drinky Spotlight",
      description:
        "For 2 turns, the group may ask you one extra question before your challenge.",
      remainingRounds: 2,
      nature: "bad",
    },
  },
  {
    id: "status-gift-2",
    type: "grantStatus",
    text: {
      en: "Fine. I'll help. Take this before I change my mind.",
      es: "Bien. Te ayudaré.\n Toma esto antes de que cambie de opinión.",
    },
    tags: ["nonDrinkerSafe"],
    image: gifts,
    statusEffect: {
      id: "drinky-favor",
      name: "Drinky Favor",
      description:
        "For 2 turns, you may reduce one non-drinking punishment by half.",
      remainingRounds: 2,
      nature: "good",
    },
  },
];
