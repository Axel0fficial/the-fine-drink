import { Challenge } from "@/types/game";

const FAVORITE_BOOST = 0.2;
const LIKE_BOOST = 0.03;
const DISLIKE_PENALTY = 0.03;

export function getChallengeOdds(challenge: Challenge): number {
  let odds = challenge.baseChance;

  if (challenge.isFavorite) {
    odds += FAVORITE_BOOST;
  }

  odds += challenge.likes * LIKE_BOOST;
  odds -= challenge.dislikes * DISLIKE_PENALTY;

  return Math.max(challenge.minChance, Math.min(odds, challenge.maxChance));
}

export function toggleFavorite(challenge: Challenge): Challenge {
  return {
    ...challenge,
    isFavorite: !challenge.isFavorite,
  };
}

export function likeChallenge(challenge: Challenge): Challenge {
  return {
    ...challenge,
    likes: challenge.likes + 1,
  };
}

export function dislikeChallenge(challenge: Challenge): Challenge {
  return {
    ...challenge,
    dislikes: challenge.dislikes + 1,
  };
}
