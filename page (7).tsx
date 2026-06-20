"use client";
import { getAllTeams, getAllMatches } from "@/data/mockData";
import { calculatePrediction } from "@/lib/prediction/model";
import { generateExplanation } from "@/lib/ai/explanation";
import { Badge } from "@/components/ui/Card";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function AnalyticsPage() {
  const matches = getAllMatches();
  const teams = getAllTeams();
  const [activeTab, setActiveTab] = useState("predictions");
  const predictions = useMemo(() => matches.map(m => ({ match: m, pred: calculatePrediction(m) })), []);
  const avgData = useMemo(() => Math.round(predictions.reduce((s, p) => s + p.pred.dataCompleteness, 0) / predictions.length), []);
  const highConf = useMemo(() => predictions.filter(p => p.pred.confidence === "high").length, []);

  const tabs = [{ id: "predictions", l: "🎯 Прогнозы" }, { id: "trends", l: "📈 Тренды" }, { id: "maps", l: "🗺️ Карты" }, { id: "players", l: "👤 Игроки" }, { id: "methodology", l: "🧠 Методология" }];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-gradient">📊 Аналитика</h1>
      <div className="flex gap-2 border-b border-white/10 overflow-x-auto">{tabs.map(t => (
        <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-4 py-2 text-xs font-medium whitespace-nowrap border-b-2 ${activeTab === t.id ? "border-purple-500 text-purple-400" : "border-transparent text-white/50 hover:text-white/80"}`}>{t.l}</button>
      ))}</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[[""+predictions.length, "Матчей"], [avgData+"%", "Полнота"], [""+highConf, "Высокая ув."], [""+teams.reduce((s,t)=>s+t.players.length,0), "Игроков"]].map(([v,l], i) => (
          <div key={i} className="glass rounded-xl p-4 text-center"><div className="text-xl font-bold text-gradient">{v}</div><div className="text-xs text-white/50 mt-1">{l}</div></div>
        ))}
      </div>

      {activeTab === "predictions" && (
        <div className="space-y-3">{predictions.map(({ match: m, pred: p }) => (
          <div key={m.id} className="glass rounded-xl p-4">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2"><Badge variant={m.importance==="very_high"?"danger":m.importance==="high"?"warning":"info"}>{m.tournament}</Badge><span className="text-xs text-white/40">{m.format}</span><span className="text-xs text-white/40">{new Date(m.startTime).toLocaleDateString("ru-RU")}</span></div>
              <Badge variant={p.confidence==="high"?"success":p.confidence==="medium"?"warning":"danger"}>{p.confidence==="high"?"🟢 Высокая":p.confidence==="medium"?"🟡 Средняя":"🔴 Низкая"} • {p.dataCompleteness}% данных</Badge>
            </div>
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex-1 text-right"><h3 className="font-bold text-white">{m.teamA.shortName}</h3><div className="text-xl font-bold text-gradient-green">{p.teamAWinProbability}%</div></div>
              <span className="text-white/20 font-bold px-3">VS</span>
              <div className="flex-1"><h3 className="font-bold text-white">{m.teamB.shortName}</h3><div className="text-xl font-bold text-gradient-gold">{p.teamBWinProbability}%</div></div>
            </div>
            <div className="flex flex-wrap gap-1 mb-2">{p.mainFactors.slice(0,2).map((f,i) => <span key={i} className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded">✅ {f}</span>)}</div>
            <div className="flex flex-wrap gap-1 mb-2">{p.risks.slice(0,2).map((r,i) => <span key={i} className="text-[10px] bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded">⚠️ {r}</span>)}</div>
            <Link href={`/matches/${m.id}`} className="text-purple-400 hover:text-purple-300 text-xs font-medium">Подробнее →</Link>
          </div>
        ))}</div>
      )}

      {activeTab === "trends" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map(team => (
            <div key={team.id} className="glass rounded-xl p-4">
              <Link href={`/teams/${team.id}`}><h3 className="font-bold text-white hover:text-purple-300">{team.name}</h3></Link>
              <div className="mt-3 space-y-2">
                {[["WR5", team.winrate5], ["WR10", team.winrate10], ["vs Top5", team.vsTop5Winrate], ["Round Diff", team.roundDiff > 0 ? "+" + team.roundDiff : team.roundDiff]].map(([l, v]: any, i) => (
                  <div key={i} className="flex justify-between text-xs"><span className="text-white/50">{l}</span><span className={typeof v === "string" ? (v.startsWith("+") ? "text-green-400" : "text-red-400") : v >= 0.6 ? "text-green-400" : v >= 0.5 ? "text-yellow-400" : "text-red-400"}>{typeof v === "string" ? v : Math.round(v * 100) + "%"}</span></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "maps" && (
        <div className="space-y-4">{["Mirage","Inferno","Nuke","Ancient","Anubis","Dust2","Train"].map(mapName => {
          const teamsOnMap = teams.map(t => ({ team: t, stats: (t.mapStats as any)[mapName] })).filter(x => x.stats).sort((a, b) => b.stats.winRate - a.stats.winRate);
          if (!teamsOnMap.length) return null;
          return (
            <div key={mapName} className="glass rounded-xl p-4">
              <h3 className="font-bold text-white mb-2">{mapName}</h3>
              <div className="space-y-2">{teamsOnMap.map(({ team, stats }) => (
                <div key={team.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Link href={`/teams/${team.id}`} className="text-sm text-white hover:text-purple-300 min-w-[80px]">{team.shortName}</Link><span className="text-[10px] text-white/30">{stats.matchesPlayed}м</span></div>
                  <div className="flex items-center gap-3"><div className="w-24 bg-white/10 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${stats.winRate>=0.65?"bg-green-500":stats.winRate>=0.5?"bg-yellow-500":"bg-red-500"}`} style={{width:`${stats.winRate*100}%`}} /></div><span className={`text-xs font-medium w-10 text-right ${stats.winRate>=0.65?"text-green-400":stats.winRate>=0.5?"text-yellow-400":"text-red-400"}`}>{Math.round(stats.winRate*100)}%</span></div>
                </div>
              ))}</div>
            </div>
          );
        })}</div>
      )}

      {activeTab === "players" && (
        <div className="glass rounded-xl overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="text-white/40 border-b border-white/10">
              <th className="text-center py-2 px-2">#</th><th className="text-left py-2 px-2">Игрок</th><th className="text-left py-2 px-2">Команда</th>
              <th className="text-right py-2 px-2">Rating</th><th className="text-right py-2 px-2">K/D</th><th className="text-right py-2 px-2">ADR</th>
              <th className="text-right py-2 px-2">Impact</th><th className="text-right py-2 px-2">HS%</th>
            </tr></thead>
            <tbody>{teams.flatMap(t => t.players.map(p => ({...p, team: t.shortName, teamId: t.id}))).sort((a, b) => b.rating - a.rating).map((p, i) => (
              <tr key={p.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-1.5 px-2 text-center text-white/30">{i+1}</td>
                <td className="py-1.5 px-2"><Link href={`/players/${p.id}`} className="font-bold text-white hover:text-purple-300">{p.nickname}</Link></td>
                <td className="py-1.5 px-2"><Link href={`/teams/${p.teamId}`} className="text-blue-400">{p.team}</Link></td>
                <td className="py-1.5 px-2 text-right font-bold text-green-400">{p.rating.toFixed(2)}</td>
                <td className="py-1.5 px-2 text-right text-white/60">{p.kd.toFixed(2)}</td>
                <td className="py-1.5 px-2 text-right text-white/60">{p.adr.toFixed(1)}</td>
                <td className="py-1.5 px-2 text-right text-white/60">{p.impact.toFixed(2)}</td>
                <td className="py-1.5 px-2 text-right text-white/60">{p.headshotPercentage}%</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}

      {activeTab === "methodology" && (
        <div className="space-y-4">
          <div className="glass rounded-xl p-5">
            <h3 className="font-bold mb-3 text-gradient">Алгоритм</h3>
            <p className="text-sm text-white/60 mb-4">Модель анализирует 30+ показателей по 7 группам факторов с настраиваемыми весами. Вероятность через сигмоиду, коррекция по формату.</p>
            {[["Общая сила команды","20%","green"],["Карты и veto","20%","green"],["Текущая форма","15%","blue"],["Индивидуальная форма","15%","blue"],["Контекст матча","13%","purple"],["Рыночные данные","10%","orange"],["Личные встречи","7%","yellow"]].map(([n,w,c], i) => (
              <div key={i} className={`p-2 rounded border border-${c}-500/30 bg-${c}-500/5 mb-2`}><div className="flex justify-between mb-0.5"><span className="text-sm font-medium text-white">{n}</span><span className="text-sm font-bold text-white/80">{w}</span></div></div>
            ))}
          </div>
          <div className="glass rounded-xl p-5">
            <h3 className="font-bold mb-3 text-gradient-gold">Коррекция по формату</h3>
            <div className="space-y-2 text-sm text-white/60">
              <div className="flex items-center gap-2"><Badge variant="danger">BO1</Badge>+25% рандома — вероятности ближе к 50/50</div>
              <div className="flex items-center gap-2"><Badge variant="info">BO3</Badge>Стандартный прогноз, наиболее стабильный</div>
              <div className="flex items-center gap-2"><Badge variant="success">BO5</Badge>+15% преимущества для сильной команды</div>
            </div>
          </div>
          <div className="glass rounded-xl p-4 border border-yellow-500/20">
            <p className="text-xs text-yellow-400/70 text-center">⚠️ Прогнозы не гарантируют исход матча и не являются финансовой рекомендацией.</p>
          </div>
        </div>
      )}
    </div>
  );
}
