import { MapName } from "../config";

export type MatchFormat = "BO1" | "BO3" | "BO5";
export type PlayerRole = "rifler" | "awper" | "igl" | "support" | "entry" | "lurker";
export type ConfidenceLevel = "low" | "medium" | "high";
export type MatchImportance = "low" | "medium" | "high" | "very_high";
export type MatchResult = "W" | "L" | "T";

export interface DataSource {
  name: string;
  url: string;
  lastUpdated: string;
  dataCompleteness: number;
}

export interface Player {
  id: string;
  nickname: string;
  realName?: string;
  country?: string;
  role: PlayerRole;
  rating: number;
  kd: number;
  adr: number;
  impact: number;
  headshotPercentage: number;
  clutchRate: number;
  openingKillRate: number;
  firstDeathRate: number;
  awpImpact?: number;
  recentForm: number[];
  stability: number;
  maps: { [key in MapName]?: { matchesPlayed: number; winRate: number; avgRating: number } };
  standIn: boolean;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo?: string;
  country?: string;
  region: string;
  worldRanking: number;
  recentRanking: number;
  coach?: string;
  players: Player[];
  recentForm: { opponent: string; result: MatchResult; score: string; tournament: string; date: string; map: string }[];
  mapStats: { [key in MapName]?: { matchesPlayed: number; wins: number; losses: number; winRate: number; roundsWon: number; roundsLost: number; pickRate: number; banRate: number } };
  teamRating: number;
  avgPlayerRating: number;
  avgKD: number;
  avgADR: number;
  avgImpact: number;
  openingKillSuccess: number;
  clutchWinrate: number;
  lanWinrate: number;
  onlineWinrate: number;
  bo1Winrate: number;
  bo3Winrate: number;
  vsTop5Winrate: number;
  vsTop10Winrate: number;
  vsTop20Winrate: number;
  vsTop30Winrate: number;
  totalMatches: number;
  winrate5: number;
  winrate10: number;
  roundDiff: number;
  historyChanges: { date: string; type: "join" | "leave" | "coach_change" | "roster_update"; player?: string; description: string }[];
}

export interface Match {
  id: string;
  teamA: Team;
  teamB: Team;
  tournament: string;
  stage?: string;
  startTime: string;
  format: MatchFormat;
  isLan: boolean;
  region: string;
  importance: MatchImportance;
  prizePool?: string;
  status: "upcoming" | "live" | "completed" | "postponed" | "cancelled";
  sources: DataSource[];
  lastDataUpdate: string;
}

export interface PredictionResult {
  matchId: string;
  teamAWinProbability: number;
  teamBWinProbability: number;
  confidence: ConfidenceLevel;
  mainFactors: string[];
  risks: string[];
  explanation: string;
  dataCompleteness: number;
  scores: { teamA: Record<string, number>; teamB: Record<string, number> };
  mapPredictions: { map: MapName; teamAWinProb: number; teamBWinProb: number; advantage: "teamA" | "teamB" | "neutral" }[];
  keyPlayers: {
    teamAKeyPlayer: { player: Player; reason: string };
    teamBKeyPlayer: { player: Player; reason: string };
    xFactor: { player: Player; reason: string };
  };
  vetoAnalysis: {
    likelyBans: { teamA: MapName[]; teamB: MapName[] };
    likelyPicks: { teamA: MapName[]; teamB: MapName[] };
    decider: MapName;
    advantageAfterVeto: "teamA" | "teamB" | "neutral";
  };
  h2hSummary: {
    totalMatches: number;
    teamAWins: number;
    teamBWins: number;
    recentMatches: { date: string; tournament: string; winner: string; score: string; maps: string[]; relevance: number }[];
  };
  timestamp: string;
}
