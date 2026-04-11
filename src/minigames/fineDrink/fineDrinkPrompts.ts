import type { FineDrinkEffect } from "../types";

export const FINE_DRINK_GOOD_EFFECTS: FineDrinkEffect[] = [
  {
    type: "action",
    text: "Regala 6",
    audience: "drinkers_only",
    tone: "good",
  },
  {
    type: "action",
    text: "Cambia tu vaso con alguien a tu eleccion",
    audience: "all",
    tone: "good",
  },
  {
    type: "status",
    text: "Por el resto de la partida regala 1 por cada desafio que completes",
    audience: "all",
    tone: "good",
    scope: "player",
    remainingRounds: null,
  },
  {
    type: "status",
    text: "Por 2 rondas, podras apuntar a algun lugar y si alguien se gira a verlo toman 2",
    audience: "all",
    tone: "good",
    scope: "global",
    remainingRounds: 2,
  },
];

export const FINE_DRINK_BAD_EFFECTS: FineDrinkEffect[] = [
  {
    type: "action",
    text: "Toma 6.",
    audience: "drinkers_only",
    tone: "bad",
  },
  {
    type: "action",
    text: "Do 12 jumping jacks.",
    audience: "non_drinkers_only",
    tone: "bad",
  },
  {
    type: "action",
    text: "Alguien mas elige con quien cambias vaso",
    audience: "all",
    tone: "bad",
  },
  {
    type: "status",
    text: "Por el resto de la partida no puedes ver la opcion B",
    audience: "all",
    tone: "bad",
    scope: "player",
    remainingRounds: null,
  },
  {
    type: "status",
    text: "Por 2 rondas todos deben decire salud cuando tomen",
    audience: "all",
    tone: "bad",
    scope: "global",
    remainingRounds: 2,
  },
  {
    type: "status",
    text: "Por 2 rondas todos deben decire salud cuando tomen",
    audience: "all",
    tone: "bad",
    scope: "global",
    remainingRounds: 2,
  },
];
