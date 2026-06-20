export interface PredictionWeights {
  teamStrength: number;
  recentForm: number;
  mapPool: number;
  playerForm: number;
  h2h: number;
  context: number;
  market: number;
}

export interface ModelConfig {
  weights: PredictionWeights;
  bo1RandomnessFactor: number;
  bo5StrengthFactor: number;
  confidenceThresholds: { high: number; medium: number; low: number };
  dataCompletenessMin: number;
  cacheTTL: number;
  rateLimitPerMinute: number;
}

export const config: ModelConfig = {
  weights: {
    teamStrength: 0.20,
    recentForm: 0.15,
    mapPool: 0.20,
    playerForm: 0.15,
    h2h: 0.07,
    context: 0.13,
    market: 0.10,
  },
  bo1RandomnessFactor: 0.25,
  bo5StrengthFactor: 0.15,
  confidenceThresholds: { high: 0.70, medium: 0.50, low: 0.30 },
  dataCompletenessMin: 60,
  cacheTTL: 3600,
  rateLimitPerMinute: 30,
};

export function getWeights(): PredictionWeights {
  return { ...config.weights };
}

export function setWeights(weights: Partial<PredictionWeights>): PredictionWeights {
  Object.assign(config.weights, weights);
  return { ...config.weights };
}

export const CURRENT_MAP_POOL = ["Mirage", "Inferno", "Nuke", "Ancient", "Anubis", "Dust2", "Train"] as const;
export type MapName = (typeof CURRENT_MAP_POOL)[number];
