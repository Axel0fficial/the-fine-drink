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
    text: "Я пьяна (YA tak p'yan)",
    tags: ["nonDrinkerSafe"],
    image: passout,
  },
  {
    id: "joke-1",
    type: "joke",
    text: "Statistically speaking, someone here is about to make a terrible choice.",
    tags: ["nonDrinkerSafe"],
    image: looms,
  },
  {
    id: "modifier-1",
    type: "challengeModifier",
    text: "Double the challenge. If you succeed, choose another player to do the original version.",
    tags: ["nonDrinkerSafe"],
    image: leans,
  },
  {
    id: "push-1",
    type: "pushChallenge",
    text: "You may push this challenge to another player. But they get to complain dramatically.",
    tags: ["nonDrinkerSafe"],
    image: leans,
  },
  {
    id: "drink-modifier-1",
    type: "challengeModifier",
    text: "Double the punishment. I believe in you. Badly.",
    tags: ["drinking"],
    image: passout,
  },

  {
    id: "second-challenge-1",
    type: "secondChallenge",
    text: "I brought you another challenge because I care. Or because I’m bored.",
    tags: ["nonDrinkerSafe"],
    image: ignores,
  },
  {
    id: "status-gift-1",
    type: "grantStatus",
    text: "Congratulations, I have gifted you a suspicious status.",
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
    text: "Fine. I’ll help. Take this before I change my mind.",
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
