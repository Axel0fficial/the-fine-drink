import type { SessionModifier } from "../types/game";

export const mockModifiers: SessionModifier[] = [
  {
    id: "mod_last_place_boost",
    title: "Last Place Boost",
    description: "The last-place player gets easier challenges.",
    type: "catch_up_bonus",
    scope: "last_place",
    enabled: true,
    isCustom: false,
    duration: "session",
    logicConfig: {
      easierChallenges: true,
    },
  },
  {
    id: "mod_shared_punishment",
    title: "Shared Punishment",
    description: "The last-place player may give half the punishment to another player for one round.",
    type: "temporary_status",
    scope: "last_place",
    enabled: false,
    isCustom: false,
    duration: "round",
    logicConfig: {
      effect: "share_half_punishment",
    },
  },
  {
    id: "mod_down_with_the_king",
    title: "Down with the King",
    description: "The current leader gets harder challenges or extra handicaps.",
    type: "leader_penalty",
    scope: "leader",
    enabled: false,
    isCustom: false,
    duration: "session",
    logicConfig: {
      harderChallenges: true,
      handicapPool: ["no_hands_round"],
    },
  },
  {
    id: "mod_bottle_flip_rule",
    title: "Bottle Flip Rule",
    description: "Do a bottle flip at the end of your turn. If you make it, give a sip.",
    type: "permanent_session_rule",
    scope: "session",
    enabled: false,
    isCustom: false,
    duration: "session",
  },
];