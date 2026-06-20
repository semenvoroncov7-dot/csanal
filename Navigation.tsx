import { Team, Match, PredictionResult, Player } from "../../types";
import { getH2H } from "../../data/mockData";

export function generateExplanation(prediction: PredictionResult, teamA: Team, teamB: Team, match: Match): string {
  const { teamAWinProbability, scores, mapPredictions, keyPlayers, h2hSummary } = prediction;
  const winner = teamAWinProbability > 50 ? teamA : teamB;
  const loser = teamAWinProbability > 50 ? teamB : teamA;
  const winnerProb = Math.max(teamAWinProbability, 100 - teamAWinProbability);

  let explanation = `${winner.name} получает ${winnerProb}% на победу `;
  
  if (scores.teamA.strength > scores.teamB.strength + 0.05) {
    explanation += `благодаря более высокому мировому рейтингу (#${teamA.worldRanking} vs #${teamB.worldRanking}) и лучшей общей статистике. `;
  } else if (scores.teamB.strength > scores.teamA.strength + 0.05) {
    explanation += `благодаря более высокому мировому рейтингу (#${teamB.worldRanking} vs #${teamA.worldRanking}) и лучшей общей статистике. `;
  } else if (scores.teamA.form > scores.teamB.form + 0.05) {
    const w = teamA.recentForm.filter(m => m.result === "W").length;
    explanation += `благодаря более стабильной форме. ${teamA.shortName} выиграл ${w} из последних ${teamA.recentForm.length} матчей. `;
  } else if (scores.teamB.form > scores.teamA.form + 0.05) {
    const w = teamB.recentForm.filter(m => m.result === "W").length;
    explanation += `благодаря более стабильной форме. ${teamB.shortName} выиграл ${w} из последних ${teamB.recentForm.length} матчей. `;
  } else {
    explanation += `благодаря совокупности факторов: форма, статистика по картам и индивидуальное мастерство игроков. `;
  }

  if (mapPredictions.length > 0) {
    const bestMap = mapPredictions.reduce((best, mp) => Math.abs(mp.teamAWinProb - mp.teamBWinProb) > Math.abs(best.teamAWinProb - best.teamBWinProb) ? mp : best);
    const teamWithAdv = bestMap.advantage === "teamA" ? teamA : teamB;
    const statsAdv = (teamWithAdv.mapStats as any)[bestMap.map];
    const statsOther = (teamWithAdv === teamA ? teamB : teamA).mapStats[bestMap.map];
    if (statsAdv && statsOther) {
      explanation += `\n\nОсобенно важным фактором является ${bestMap.map}, где ${teamWithAdv.shortName} имеет ${Math.round(statsAdv.winRate*100)}% побед, тогда как ${teamWithAdv === teamA ? teamB.shortName : teamA.shortName} — ${Math.round(statsOther.winRate*100)}%.`;
    }
  }

  const winnerKeyPlayer = teamAWinProbability > 50 ? keyPlayers.teamAKeyPlayer : keyPlayers.teamBKeyPlayer;
  explanation += `\n\nКлючевой игрок: ${winnerKeyPlayer.player.nickname} (${winnerKeyPlayer.player.rating.toFixed(2)} rating, ${winnerKeyPlayer.player.adr?.toFixed(1)} ADR). ${winnerKeyPlayer.reason}`;
  explanation += `\n\nX-factor: ${keyPlayers.xFactor.player.nickname} — ${keyPlayers.xFactor.reason}`;

  if (h2hSummary.totalMatches > 0) {
    const h2hLeader = h2hSummary.teamAWins > h2hSummary.totalMatches / 2 ? teamA : teamB;
    explanation += `\n\nВ личных встречах ${h2hLeader.shortName} ведёт ${h2hSummary.teamAWins}:${h2hSummary.totalMatches - h2hSummary.teamAWins}.`;
    if (h2hSummary.recentMatches.length > 0) {
      const lm = h2hSummary.recentMatches[0];
      explanation += ` Последняя встреча: ${lm.tournament} (${lm.date}), ${lm.winner} ${lm.score}.`;
    }
  }

  if (prediction.risks.length > 0) {
    explanation += `\n\nРиски: ${prediction.risks.slice(0, 3).join(". ")}.`;
  }

  const confidenceText = {
    high: "высокий — все факторы согласованы",
    medium: "средний — некоторые факторы противоречат",
    low: "низкий — недостаточно данных",
  };
  explanation += `\n\nУверенность: ${prediction.confidence} (${confidenceText[prediction.confidence]}).`;
  explanation += `\n\n⚠️ Прогнозы являются аналитической оценкой. Не гарантируют исход и не являются финансовой рекомендацией.`;

  return explanation;
}

export function generateShortPrediction(prediction: PredictionResult, teamA: Team, teamB: Team): string {
  const winner = prediction.teamAWinProbability > 50 ? teamA : teamB;
  const wp = Math.max(prediction.teamAWinProbability, 100 - prediction.teamAWinProbability);
  return `${winner.shortName} — ${wp}%: ${prediction.mainFactors[0] || "преимущество по совокупности факторов"}`;
}
