export type Screen = 'menu' | 'shop' | 'difficulty' | 'game' | 'pause' | 'achievements' | 'gameOver';
export type Difficulty = 'easy' | 'normal' | 'hard';

export interface Blogger {
  id: string;
  name: string;
  image: string;
  price: number;
  unlocked: boolean;
}

export interface FallingBlogger {
  id: string;
  bloggerId: string;
  x: number;
  y: number;
  speed: number;
  rotation: number;
  image: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  requirement: number;
  progress: number;
}

export const difficultySettings = {
  easy: { speed: 2, spawnRate: 1500, multiplier: 1 },
  normal: { speed: 3.5, spawnRate: 1000, multiplier: 1.5 },
  hard: { speed: 5, spawnRate: 700, multiplier: 2 },
};
