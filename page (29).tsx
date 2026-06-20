import { Match } from "@/types";
import { calculatePrediction } from "@/lib/prediction/model";
import { generateExplanation } from "@/lib/ai/explanation";
import { Badge, ConfidenceIndicator, ProgressBar, TeamLogo, MapBadge } from "@/components/ui/Card";

export function MatchDetail({ match }: { match: Match }) {
  const prediction = calculatePrediction(match);
  const explanation = generateExplanation(prediction, match.teamA, match.teamB, match);

  const fmtTime = (d: string) => new Date(d).toLocaleString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Krasnoyarsk" }) + " (KRAT)";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-xl p-6 glow-purple">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="info">{match.tournament}</Badge>
            {match.stage && <Badge>{match.stage}</Badge>}
            {match.isLan && <Badge variant="success">🌐 LAN</Badge>}
            {!match.isLan && <Badge>💻 Online</Badge>}
            {match.prizePool && <Badge variant="warning">💰 {match.prizePool}</Badge>}
          </div>
          <span className="text-xs text-white/40">{fmtTime(match.startTime)}</span>
        </div>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex-1 text-center">
            <TeamLogo name={match.teamA.shortName} size="lg" />
            <h2 className="text-xl font-bold">{match.teamA.name}</h2>
            <p className="text-xs text-white/50">#{match.teamA.worldRanking} • {match.teamA.region}</p>
            <div className="mt-2 text-4xl font-bold text-gradient-green">{prediction.teamAWinProbability}%</div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-white/20 font-bold text-2xl">VS</span>
            <Badge variant="info">{match.format}</Badge>
            <ConfidenceIndicator level={prediction.confidence} />
          </div>
          <div className="flex-1 text-center">
            <TeamLogo name={match.teamB.shortName} size="lg" />
            <h2 className="text-xl font-bold">{match.teamB.name}</h2>
            <p className="text-xs text-white/50">#{match.teamB.worldRanking} • {match.teamB.region}</p>
            <div className="mt-2 text-4xl font-bold text-gradient-gold">{prediction.teamBWinProbability}%</div>
          </div>
        </div>
        <div className="h-3 rounded-full overflow-hidden bg-white/10 flex">
          <div className="bg-gradient-to-r from-green-600 to-green-400 transition-all" style={{ width: `${prediction.teamAWinProbability}%` }} />
          <div className="bg-gradient-to-r from-orange-400 to-orange-600 transition-all" style={{ width: `${prediction.teamBWinProbability}%` }} />
        </div>
      </div>

      {/* AI Explanation */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-bold mb-3 text-gradient">🤖 Прогноз AI</h3>
        <div className="text-white/70 text-sm whitespace-pre-wrap leading-relaxed">{explanation}</div>
      </div>

      {/* Factors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass rounded-xl p-5">
          <h3 className="font-bold text-green-400 mb-3">✅ Факторы победы</h3>
          <ul className="space-y-1.5">{prediction.mainFactors.map((f, i) => <li key={i} className="text-sm text-white/70 flex items-start gap-1.5"><span className="text-green-400 mt-0.5">•</span>{f}</li>)}</ul>
        </div>
        <div className="glass rounded-xl p-5">
          <h3 className="font-bold text-yellow-400 mb-3">⚠️ Риски</h3>
          <ul className="space-y-1.5">{prediction.risks.map((r, i) => <li key={i} className="text-sm text-white/70 flex items-start gap-1.5"><span className="text-yellow-400 mt-0.5">⚡</span>{r}</li>)}</ul>
        </div>
      </div>

      {/* Team Comparison */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4 text-gradient-blue">📊 Сравнение команд</h3>
        <div className="grid grid-cols-3 gap-x-4 text-sm mb-1 text-white/40"><div className="text-right">{match.teamA.shortName}</div><div className="text-center">Метрика</div><div className="text-left">{match.teamB.shortName}</div></div>
        {compRow("Мировой рейтинг", `#${match.teamA.worldRanking}`, `#${match.teamB.worldRanking}`, match.teamA.worldRanking < match.teamB.worldRanking ? "a" : "b")}
        {compRow("Рейтинг (3 мес)", `#${match.teamA.recentRanking}`, `#${match.teamB.recentRanking}`, match.teamA.recentRanking < match.teamB.recentRanking ? "a" : "b")}
        {compRow("Winrate 5", `${Math.round(match.teamA.winrate5*100)}%`, `${Math.round(match.teamB.winrate5*100)}%`, match.teamA.winrate5 > match.teamB.winrate5 ? "a" : match.teamA.winrate5 < match.teamB.winrate5 ? "b" : "neutral")}
        {compRow("Winrate 10", `${Math.round(match.teamA.winrate10*100)}%`, `${Math.round(match.teamB.winrate10*100)}%`, match.teamA.winrate10 > match.teamB.winrate10 ? "a" : match.teamA.winrate10 < match.teamB.winrate10 ? "b" : "neutral")}
        {compRow("Общий рейтинг", match.teamA.teamRating.toFixed(2), match.teamB.teamRating.toFixed(2), match.teamA.teamRating > match.teamB.teamRating ? "a" : "b")}
        {compRow("K/D", match.teamA.avgKD.toFixed(2), match.teamB.avgKD.toFixed(2), match.teamA.avgKD > match.teamB.avgKD ? "a" : "b")}
        {compRow("ADR", match.teamA.avgADR.toFixed(1), match.teamB.avgADR.toFixed(1), match.teamA.avgADR > match.teamB.avgADR ? "a" : "b")}
        {compRow("Opening Kill %", (match.teamA.openingKillSuccess*100).toFixed(1)+"%", (match.teamB.openingKillSuccess*100).toFixed(1)+"%", match.teamA.openingKillSuccess > match.teamB.openingKillSuccess ? "a" : "b")}
        {compRow("Clutch WR", (match.teamA.clutchWinrate*100).toFixed(0)+"%", (match.teamB.clutchWinrate*100).toFixed(0)+"%", match.teamA.clutchWinrate > match.teamB.clutchWinrate ? "a" : "b")}
        {compRow("LAN WR", (match.teamA.lanWinrate*100).toFixed(0)+"%", (match.teamB.lanWinrate*100).toFixed(0)+"%", match.teamA.lanWinrate > match.teamB.lanWinrate ? "a" : "b")}
        {compRow("BO1 WR", (match.teamA.bo1Winrate*100).toFixed(0)+"%", (match.teamB.bo1Winrate*100).toFixed(0)+"%", match.teamA.bo1Winrate > match.teamB.bo1Winrate ? "a" : "b")}
        {compRow("BO3 WR", (match.teamA.bo3Winrate*100).toFixed(0)+"%", (match.teamB.bo3Winrate*100).toFixed(0)+"%", match.teamA.bo3Winrate > match.teamB.bo3Winrate ? "a" : "b")}
        {compRow("vs Top 5", (match.teamA.vsTop5Winrate*100).toFixed(0)+"%", (match.teamB.vsTop5Winrate*100).toFixed(0)+"%", match.teamA.vsTop5Winrate > match.teamB.vsTop5Winrate ? "a" : "b")}
        {compRow("vs Top 10", (match.teamA.vsTop10Winrate*100).toFixed(0)+"%", (match.teamB.vsTop10Winrate*100).toFixed(0)+"%", match.teamA.vsTop10Winrate > match.teamB.vsTop10Winrate ? "a" : "b")}
      </div>

      {/* Maps */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4 text-gradient-gold">🗺️ Статистика по картам</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {prediction.mapPredictions.map(mp => (
            <div key={mp.map} className="glass rounded-lg p-3 border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-white text-sm">{mp.map}</h4>
                <MapBadge map={mp.map} advantage={mp.advantage === "teamA" ? "a" : mp.advantage === "teamB" ? "b" : "neutral"} />
              </div>
              <div className="flex gap-4">
                <div className="flex-1"><p className="text-[10px] text-white/40 mb-0.5">{match.teamA.shortName}</p><div className="text-base font-bold text-green-400">{mp.teamAWinProb}%</div><ProgressBar value={mp.teamAWinProb} color="green" /></div>
                <div className="flex-1"><p className="text-[10px] text-white/40 mb-0.5">{match.teamB.shortName}</p><div className="text-base font-bold text-orange-400">{mp.teamBWinProb}%</div><ProgressBar value={mp.teamBWinProb} color="orange" /></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Veto */}
      <div className="glass rounded-xl p-5">
        <h3 className="text-lg font-bold mb-3 text-gradient">🚫 Veto-анализ</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><h4 className="text-xs font-medium text-red-400 mb-2">Баны {match.teamA.shortName}</h4><div className="flex flex-wrap gap-1">{prediction.vetoAnalysis.likelyBans.teamA.map(m => <MapBadge key={m} map={m} advantage="a" />)}</div></div>
          <div><h4 className="text-xs font-medium text-red-400 mb-2">Баны {match.teamB.shortName}</h4><div className="flex flex-wrap gap-1">{prediction.vetoAnalysis.likelyBans.teamB.map(m => <MapBadge key={m} map={m} advantage="b" />)}</div></div>
          <div><h4 className="text-xs font-medium text-green-400 mb-2">Decider</h4><MapBadge map={prediction.vetoAnalysis.decider} /></div>
        </div>
      </div>

      {/* Players */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4 text-gradient-blue">👤 Игроки</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="glass rounded-lg p-4 border border-green-500/20"><h4 className="text-xs font-medium text-green-400 mb-2">Ключевой {match.teamA.shortName}</h4><PlayerMini player={prediction.keyPlayers.teamAKeyPlayer.player} reason={prediction.keyPlayers.teamAKeyPlayer.reason} /></div>
          <div className="glass rounded-lg p-4 border border-orange-500/20"><h4 className="text-xs font-medium text-orange-400 mb-2">Ключевой {match.teamB.shortName}</h4><PlayerMini player={prediction.keyPlayers.teamBKeyPlayer.player} reason={prediction.keyPlayers.teamBKeyPlayer.reason} /></div>
        </div>
        <div className="glass rounded-lg p-4 border border-purple-500/20 mb-4"><h4 className="text-xs font-medium text-purple-400 mb-2">⚡ X-Factor</h4><PlayerMini player={prediction.keyPlayers.xFactor.player} reason={prediction.keyPlayers.xFactor.reason} /></div>
        {[match.teamA, match.teamB].map(team => (
          <div key={team.id} className="mt-4">
            <h4 className="font-bold text-white mb-2">{team.shortName}</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="text-white/40 border-b border-white/10">
                  <th className="text-left py-1.5 px-1">Ник</th><th className="text-left py-1.5 px-1">Роль</th>
                  <th className="text-right py-1.5 px-1">Rating</th><th className="text-right py-1.5 px-1">K/D</th>
                  <th className="text-right py-1.5 px-1">ADR</th><th className="text-right py-1.5 px-1">Impact</th>
                  <th className="text-right py-1.5 px-1">HS%</th><th className="text-right py-1.5 px-1">Clutch</th>
                </tr></thead>
                <tbody>{team.players.map(p => (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-1.5 px-1 font-medium text-white">{p.nickname}</td>
                    <td className="py-1.5 px-1 text-white/50 capitalize">{p.role}</td>
                    <td className="py-1.5 px-1 text-right font-bold text-green-400">{p.rating.toFixed(2)}</td>
                    <td className="py-1.5 px-1 text-right text-white/70">{p.kd.toFixed(2)}</td>
                    <td className="py-1.5 px-1 text-right text-white/70">{p.adr.toFixed(1)}</td>
                    <td className="py-1.5 px-1 text-right text-white/70">{p.impact.toFixed(2)}</td>
                    <td className="py-1.5 px-1 text-right text-white/70">{p.headshotPercentage}%</td>
                    <td className="py-1.5 px-1 text-right text-white/70">{(p.clutchRate*100).toFixed(0)}%</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* H2H */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4 text-gradient">🤝 История личных встреч</h3>
        <div className="flex items-center justify-center gap-8 mb-4">
          <div className="text-center"><div className="text-2xl font-bold text-green-400">{prediction.h2hSummary.teamAWins}</div><div className="text-xs text-white/50">{match.teamA.shortName}</div></div>
          <div className="text-center"><div className="text-lg text-white/20">—</div><div className="text-[10px] text-white/40">{prediction.h2hSummary.totalMatches} матчей</div></div>
          <div className="text-center"><div className="text-2xl font-bold text-orange-400">{prediction.h2hSummary.teamBWins}</div><div className="text-xs text-white/50">{match.teamB.shortName}</div></div>
        </div>
        {prediction.h2hSummary.recentMatches.length > 0 && (
          <div className="space-y-2">{prediction.h2hSummary.recentMatches.map((m, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 px-3 bg-white/5 rounded text-xs">
              <span className="text-white/40">{m.date} • {m.tournament}</span>
              <span className="text-white/70">{m.winner} {m.score}</span>
              <div className="flex gap-1">{m.maps.map((mp, mi) => <MapBadge key={mi} map={mp} />)}</div>
            </div>
          ))}</div>
        )}
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[match.teamA, match.teamB].map(team => (
          <div key={team.id} className="glass rounded-xl p-5">
            <h3 className="font-bold mb-2 text-sm">{team.shortName} — форма</h3>
            <div className="flex gap-1.5 mb-2">{team.recentForm.map((m, i) => (
              <div key={i} className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${m.result === "W" ? "bg-green-500/20 text-green-400" : m.result === "L" ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"}`} title={`${m.result} vs ${m.opponent}`}>{m.result}</div>
            ))}</div>
            <div className="space-y-1">{team.recentForm.slice(0, 5).map((m, i) => (
              <div key={i} className="flex justify-between text-xs"><span className="text-white/40">{m.date}</span><span className={m.result === "W" ? "text-green-400" : "text-red-400"}>{m.result === "W" ? "✓" : "✗"} {m.score} vs {m.opponent}</span></div>
            ))}</div>
          </div>
        ))}
      </div>

      {/* Sources */}
      <div className="glass rounded-xl p-5">
        <h3 className="font-bold mb-3 text-sm text-white/70">📡 Источники данных</h3>
        <div className="space-y-2">{match.sources.map((s, i) => (
          <div key={i} className="flex items-center justify-between py-1.5 px-3 bg-white/5 rounded text-xs">
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">{s.name}</a>
            <span className="text-white/40">{new Date(s.lastUpdated).toLocaleString("ru-RU")}</span>
            <ProgressBar value={s.dataCompleteness} color={s.dataCompleteness > 85 ? "green" : "yellow"} />
          </div>
        ))}</div>
        <div className="mt-3 flex justify-between text-xs"><span className="text-white/50">Полнота данных:</span><span className="font-bold text-white">{prediction.dataCompleteness}%</span></div>
      </div>

      {/* Disclaimer */}
      <div className="glass rounded-xl p-4 border border-yellow-500/20">
        <p className="text-xs text-yellow-400/70 text-center">⚠️ Прогнозы являются аналитической оценкой на основе статистики. Не гарантируют исход и не являются финансовой рекомендацией.</p>
      </div>
    </div>
  );
}

function compRow(label: string, a: string, b: string, adv: "a" | "b" | "neutral") {
  return <div className="grid grid-cols-3 gap-4 py-2 border-b border-white/5 text-sm">
    <div className={`text-right font-medium ${adv === "a" ? "text-green-400" : "text-white/70"}`}>{a}</div>
    <div className="text-center text-white/40">{label}</div>
    <div className={`text-left font-medium ${adv === "b" ? "text-green-400" : "text-white/70"}`}>{b}</div>
  </div>;
}

function PlayerMini({ player, reason }: { player: any; reason: string }) {
  const emojis: Record<string, string> = { awper: "🎯", rifler: "🔫", igl: "🧠", support: "🛡️", entry: "⚡", lurker: "👻" };
  return (
    <div className="flex items-center gap-3">
      <TeamLogo name={player.nickname} size="sm" />
      <div className="flex-1">
        <div className="flex items-center gap-2"><h4 className="font-bold text-white text-sm">{player.nickname}</h4><span className="text-[10px] text-white/40">{emojis[player.role]} {player.role}</span>{player.standIn && <span className="text-[10px] text-red-400">(stand-in)</span>}</div>
        <p className="text-[10px] text-white/50 mt-0.5">{reason}</p>
        <div className="flex gap-2 mt-1 text-[10px] text-white/40"><span>R: {player.rating.toFixed(2)}</span><span>K/D: {player.kd.toFixed(2)}</span><span>ADR: {player.adr.toFixed(1)}</span></div>
      </div>
    </div>
  );
}
