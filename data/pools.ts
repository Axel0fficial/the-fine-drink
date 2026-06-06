export const variablePools = {
  attractivePeople: ["Barbie", "Lara Croft", "Wonder Woman", "Leon Kennedy"],

  villains: ["Darth Vader", "The Grinch", "Bowser", "Voldemort"],

  lovablePeople: ["Shrek", "SpongeBob", "Mario", "Paddington"],

  exercises: ["jumping jacks", "pushups", "situps", "squats"],

  celebrities: ["Pitt"],

  animals: ["asd"],

  categories: ["animals"],

  wouldYouRather: ["invisible"],
} as const;

export type PoolKey = keyof typeof variablePools;
