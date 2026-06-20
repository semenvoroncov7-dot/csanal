import { config, getWeights, MapName } from "../../config";
import { Team, Match, PredictionResult, Player } from "../../types";
import { getH2H } from "../../data/mockData";

function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0.5;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

function calculateTeamStrengthScore(team: Team): number {
  const worldRankingNorm = 1 - normalize(team.worldRanking, 1, 50);
  const recentRankingNorm = 1 - normalize(team.recentRanking, 1, 50);
  const vsTop5Norm = normalize(team.vsTop5Winrate, 0.2, 0.8);
  const vsTop10Norm = normalize(team.vsTop10Winrate, 0.3, 0.9);
  const teamRatingNorm = normalize(team.teamRating, 0.8, 1.5);
  return worldRankingNorm * 0.25 + recentRankingNorm * 0.20 + vsTop5Norm * 0.25 + vsTop10Norm * 0.15 + teamRatingNorm * 0.15;
}

function calculateRecentFormScore(team: Team): number {
  const winrate5Norm = normalize(team.winrate5, 0, 1);
  const winrate10Norm = normalize(team.winrate10, 0, 1);
  const roundDiffNorm = normalize(team.roundDiff, -200, 300);
  const recentMatches = team.recentForm.slice(0, 5);
  const wins = recentMatches.filter(m => m.result === "W").length;
  const recentFormNorm = recentMatches.length > 0 ? wins / recentMatches.length : 0.5;
  let streakBonus = 0;
  for (let i = 0; i < recentMatches.length; i++) {
    if (recentMatches[i].result === "W") streakBonus += 0.05 * (recentMatches.length - i);
    else break;
  }
  return Math.min(1, winrate5Norm * 0.35 + winrate10Norm * 0.25 + roundDiffNorm * 0.20 + recentFormNorm * 0.10 + streakBonus);
}

function calculateMapPoolScore(teamA: Team, teamB: Team): number {
  const maps: MapName[] = ["Mirage", "Inferno", "Nuke", "Ancient", "Anubis", "Dust2", "Train"];
  let teamAAdvantage = 0;
  let mapCount = 0;
  for (const map of maps) {
    const statsA = teamA.mapStats[map];
    const statsB = teamB.mapStats[map];
    if (statsA && statsB) { teamAAdvantage += statsA.winRate - statsB.winRate; mapCount++; }
  }
  return mapCount > 0 ? normalize(0.5 + teamAAdvantage / (mapCount * 2), 0, 1) : 0.5;
}

function calculatePlayerFormScore(team: Team): number {
  const players = team.players.filter(p => !p.standIn);
  if (players.length === 0) return 0.5;
  let totalRating = 0, totalForm = 0, totalStability = 0, totalImpact = 0;
  for (const p of players) {
    totalRating += normalize(p.rating, 0.7, 1.5);
    const avgForm = p.recentForm.length > 0 ? p.recentForm.reduce((a, b) => a + b, 0) / p.recentForm.length : p.rating;
    totalForm += normalize(avgForm, 0.7, 1.5);
    totalStability += p.stability;
    totalImpact += normalize(p.impact, 0.5, 1.8);
  }
  const n = players.length;
  return (totalRating / n) * 0.30 + (totalForm / n) * 0.30 + (totalStability / n) * 0.20 + (totalImpact / n) * 0.20;
}

function calculateH2HScore(teamA: Team, teamB: Team): number {
  const h2h = getH2H(teamA, teamB);
  if (h2h.total === 0 || h2h.matches.length === 0) return 0.5;
  let weightedScore = 0, totalWeight = 0;
  for (const m of h2h.matches) {
    const isTeamAWin = m.winner === teamA.name || m.winner === teamA.shortName;
    weightedScore += (isTeamAWin ? 1 : 0) * m.relevance;
    totalWeight += m.relevance;
  }
  const rawScore = totalWeight > 0 ? weightedScore / totalWeight : 0.5;
  const rosterChanges = [...teamA.historyChanges, ...teamB.historyChanges].filter(c => c.type === "roster_update").length;
  const relevancePenalty = rosterChanges * 0.05;
  return Math.max(0.2, Math.min(0.8, rawScore - relevancePenalty + 0.5));
}

function calculateContextScore(teamA: Team, teamB: Team, match: Match): number {
  let score = match.isLan ? normalize(teamA.lanWinrate, 0.4, 0.9) : normalize(teamA.onlineWinrate, 0.4, 0.9);
  score *= match.isLan ? 0.30 : 0.30;
  if (match.format === "BO1") score = score * (1 - config.bo1RandomnessFactor) + 0.5 * config.bo1RandomnessFactor;
  else if (match.format === "BO5") {
    const strengthAdvantage = teamA.worldRanking < teamB.worldRanking ? 0.1 : -0.1;
    score = score * (1 + config.bo5StrengthFactor) + strengthAdvantage;
  }
  if (teamA.recentForm.length > 10 && teamB.recentForm.length < 5) score *= 0.95;
  score -= teamA.players.filter(p => p.standIn).length * 0.05;
  return Math.max(0.1, Math.min(0.9, score));
}

function calculateMarketScore(teamA: Team, teamB: Team): number {
  const ratingDiff = teamA.teamRating - teamB.teamRating;
  return normalize(0.5 + ratingDiff * 0.3, 0, 1);
}

function generateMainFactors(teamA: Team, teamB: Team, scoresA: Record<string, number>, scoresB: Record<string, number>, match: Match): string[] {
  const factors: string[] = [];
  if (scoresA.form > scoresB.form + 0.1) factors.push(`${teamA.shortName} показывает значительно лучшую форму за последние матчи`);
  else if (scoresB.form > scoresA.form + 0.1) factors.push(`${teamB.shortName} находится в лучшей форме`);
  const maps = ["Mirage", "Inferno", "Nuke", "Ancient", "Anubis", "Dust2", "Train"];
  for (const map of maps) {
    const statsA = (teamA.mapStats as any)[map];
    const statsB = (teamB.mapStats as any)[map];
    if (statsA && statsB && statsA.winRate > statsB.winRate + 0.1) factors.push(`${teamA.shortName} имеет преимущество на ${map} (${Math.round(statsA.winRate*100)}% vs ${Math.round(statsB.winRate*100)}%)`);
    else if (statsA && statsB && statsB.winRate > statsA.winRate + 0.1) factors.push(`${teamB.shortName} сильнее на ${map} (${Math.round(statsB.winRate*100)}% vs ${Math.round(statsA.winRate*100)}%)`);
  }
  if (scoresA.playerForm > scoresB.playerForm + 0.05) factors.push(`Средний рейтинг игроков ${teamA.shortName} выше (${teamA.avgPlayerRating.toFixed(2)} vs ${teamB.avgPlayerRating.toFixed(2)})`);
  if (match.format === "BO1") factors.push("BO1 формат увеличивает вероятность случайного результата");
  if (match.isLan) {
    const betterLan = teamA.lanWinrate > teamB.lanWinrate ? teamA : teamB;
    factors.push(`${betterLan.shortName} лучше выступает на LAN (${Math.round(betterLan.lanWinrate*100)}%)`);
  }
  return factors.length > 0 ? factors : ["Обе команды показывают близкие результаты"];
}

function generateRisks(teamA: Team, teamB: Team, match: Match): string[] {
  const risks: string[] = [];
  const teamAStandIns = teamA.players.filter(p => p.standIn);
  const teamBStandIns = teamB.players.filter(p => p.standIn);
  if (teamAStandIns.length > 0) risks.push(`${teamA.shortName} играет с заменой`);
  if (teamBStandIns.length > 0) risks.push(`${teamB.shortName} имеет игрока на замене`);
  if (match.format === "BO1") risks.push("BO1 формат — высокий шанс upset");
  const maps = ["Mirage", "Inferno", "Nuke", "Ancient", "Anubis", "Dust2", "Train"];
  for (const map of maps) {
    const statsA = (teamA.mapStats as any)[map];
    const statsB = (teamB.mapStats as any)[map];
    if (statsA && statsB && Math.abs(statsA.winRate - statsB.winRate) > 0.15) {
      const advTeam = statsA.winRate > statsB.winRate ? teamA : teamB;
      risks.push(`${advTeam.shortName} может получить преимущество на ${map}`);
    }
  }
  return risks;
}

function generateMapPredictions(teamA: Team, teamB: Team) {
  const maps: MapName[] = ["Mirage", "Inferno", "Nuke", "Ancient", "Anubis", "Dust2", "Train"];
  const predictions = [];
  for (const map of maps) {
    const statsA = teamA.mapStats[map];
    const statsB = teamB.mapStats[map];
    if (statsA && statsB) {
      const diff = statsA.winRate - statsB.winRate;
      const probA = Math.round((0.5 + diff * 2) * 100);
      predictions.push({ map, teamAWinProb: Math.max(15, Math.min(85, probA)), teamBWinProb: 100 - Math.max(15, Math.min(85, probA)), advantage: diff > 0.05 ? "teamA" as const : diff < -0.05 ? "teamB" as const : "neutral" as const });
    }
  }
  return predictions;
}

function generateKeyPlayers(teamA: Team, teamB: Team) {
  const bestA = teamA.players.reduce((best, p) => p.rating > best.rating ? p : best);
  const bestB = teamB.players.reduce((best, p) => p.rating > best.rating ? p : best);
  const all = [...teamA.players, ...teamB.players];
  const xF = all.reduce((xf, p) => {
    const v1 = Math.max(...p.recentForm) - Math.min(...p.recentForm);
    const v2 = Math.max(...xf.recentForm) - Math.min(...xf.recentForm);
    return v1 > v2 ? p : xf;
  });
  return {
    teamAKeyPlayer: { player: bestA, reason: `Лучший игрок ${teamA.shortName} с рейтингом ${bestA.rating.toFixed(2)}` },
    teamBKeyPlayer: { player: bestB, reason: `Лучший игрок ${teamB.shortName} с рейтингом ${bestB.rating.toFixed(2)}` },
    xFactor: { player: xF, reason: `${xF.nickname} показывает наибольшую вариативность формы` },
  };
}

function generateVetoAnalysis(teamA: Team, teamB: Team) {
  const maps: MapName[] = ["Mirage", "Inferno", "Nuke", "Ancient", "Anubis", "Dust2", "Train"];
  const teamAWorst = maps.filter(m => (teamA.mapStats as any)[m]).sort((a, b) => ((teamA.mapStats as any)[a]?.winRate || 0) - ((teamA.mapStats as any)[b]?.winRate || 0)).slice(0, 2) as MapName[];
  const teamBWorst = maps.filter(m => (teamB.mapStats as any)[m]).sort((a, b) => ((teamB.mapStats as any)[a]?.winRate || 0) - ((teamB.mapStats as any)[b]?.winRate || 0)).slice(0, 2) as MapName[];
  const vetoed = new Set([...teamAWorst, ...teamBWorst]);
  const remaining = maps.filter(m => !vetoed.has(m));
  const decider = remaining[Math.floor(remaining.length / 2)] || "Mirage";
  return { likelyBans: { teamA: teamAWorst, teamB: teamBWorst }, likelyPicks: { teamA: [], teamB: [] }, decider, advantageAfterVeto: "neutral" as const };
}

export function calculatePrediction(match: Match): PredictionResult {
  const weights = getWeights();
  const { teamA, teamB } = match;

  const scoresA = { strength: calculateTeamStrengthScore(teamA), form: calculateRecentFormScore(teamA), mapPool: calculateMapPoolScore(teamA, teamB), playerForm: calculatePlayerFormScore(teamA), h2h: calculateH2HScore(teamA, teamB), context: calculateContextScore(teamA, teamB, match), market: calculateMarketScore(teamA, teamB) };
  const scoresB = { strength: calculateTeamStrengthScore(teamB), form: calculateRecentFormScore(teamB), mapPool: 1 - calculateMapPoolScore(teamA, teamB), playerForm: calculatePlayerFormScore(teamB), h2h: 1 - calculateH2HScore(teamA, teamB), context: 1 - calculateContextScore(teamA, teamB, match), market: 1 - calculateMarketScore(teamA, teamB) };

  const totalScoreA = scoresA.strength * weights.teamStrength + scoresA.form * weights.recentForm + scoresA.mapPool * weights.mapPool + scoresA.playerForm * weights.playerForm + scoresA.h2h * weights.h2h + scoresA.context * weights.context + scoresA.market * weights.market;
  const totalScoreB = scoresB.strength * weights.teamStrength + scoresB.form * weights.recentForm + scoresB.mapPool * weights.mapPool + scoresB.playerForm * weights.playerForm + scoresB.h2h * weights.h2h + scoresB.context * weights.context + scoresB.market * weights.market;

  const scoreDiff = totalScoreA - totalScoreB;
  const sigmoidVal = sigmoid(scoreDiff * 4);
  const teamAWinProbability = Math.round(sigmoidVal * 100);
  const teamBWinProbability = 100 - teamAWinProbability;

  const dataCompleteness = Math.min(...match.sources.map(s => s.dataCompleteness));
  const scoreDiffAbs = Math.abs(scoreDiff);
  const agreement = 1 - Math.max(Math.abs(scoresA.strength - scoresB.strength), Math.abs(scoresA.form - scoresB.form), Math.abs(scoresA.mapPool - scoresB.mapPool), Math.abs(scoresA.playerForm - scoresB.playerForm));
  const confidenceScore = (dataCompleteness / 100) * 0.4 + scoreDiffAbs * 0.3 + agreement * 0.3;
  let confidence: "low" | "medium" | "high";
  if (confidenceScore >= config.confidenceThresholds.high) confidence = "high";
  else if (confidenceScore >= config.confidenceThresholds.medium) confidence = "medium";
  else confidence = "low";

  const h2h = getH2H(teamA, teamB);

  return {
    matchId: match.id, teamAWinProbability, teamBWinProbability, confidence,
    mainFactors: generateMainFactors(teamA, teamB, scoresA, scoresB, match),
    risks: generateRisks(teamA, teamB, match),
    explanation: "", dataCompleteness,
    scores: { teamA: { ...scoresA, total: totalScoreA }, teamB: { ...scoresB, total: totalScoreB } },
    mapPredictions: generateMapPredictions(teamA, teamB),
    keyPlayers: generateKeyPlayers(teamA, teamB),
    vetoAnalysis: generateVetoAnalysis(teamA, teamB),
    h2hSummary: { totalMatches: h2h.total, teamAWins: h2h.teamAWins, teamBWins: h2h.total - h2h.teamAWins, recentMatches: h2h.matches },
    timestamp: new Date().toISOString(),
  };
}
