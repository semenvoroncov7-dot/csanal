"use client";
import { getAllTeams } from "@/data/mockData";
import { TeamLogo, Badge } from "@/components/ui/Card";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function RankingsPage() {
  const teams = getAllTeams();
  const [sortBy, setSortBy] = useState("worldRanking");
  const sorted = useMemo(() => [...teams].sort((a: any, b: any) => {
    const av = a[sortBy], bv = b[sortBy];
    return sortBy === "totalMatches" || sortBy === "roundDiff" || sortBy === "teamRating" ? bv - av : av - bv;
  }), [teams, sortBy]);
  const opts = [{ v: "worldRanking", l: "Мировой" }, { v: "recentRanking", l: "3 мес." }, { v: "teamRating", l: "Рейтинг" }, { v: "winrate5", l: "WR5" }, { v: "winrate10", l: "WR10" }, { v: "lanWinrate", l: "LAN" }, { v: "bo3Winrate", l: "BO3" }];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-gradient">🏆 Рейтинги команд</h1>
      <div className="flex flex-wrap gap-2">{opts.map(o => (
        <button key={o.v} onClick={() => setSortBy(o.v)} className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${sortBy === o.v ? "bg-purple-600 text-white" : "bg-white/5 text-white/50 hover:text-white hover:bg-white/10"}`}>{o.l}</button>
      ))}</div>
      <div className="glass rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="bg-white/5 text-white/40 border-b border-white/10">
            <th className="text-center py-2 px-2 w-12">#</th><th className="text-left py-2 px-2">Команда</th>
            <th className="text-center py-2 px-2">Мировой</th><th className="text-center py-2 px-2">3 мес.</th>
            <th className="text-center py-2 px-2">Рейтинг</th><th className="text-center py-2 px-2">WR5</th>
            <th className="text-center py-2 px-2">WR10</th><th className="text-center py-2 px-2">LAN</th>
            <th className="text-center py-2 px-2">BO3</th><th className="text-center py-2 px-2">Матчей</th>
          </tr></thead>
          <tbody>{sorted.map((team: any, i: number) => (
            <tr key={team.id} className="border-b border-white/5 hover:bg-white/5">
              <td className="py-2 px-2 text-center"><div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mx-auto ${i===0?"bg-yellow-500/20 text-yellow-400":i===1?"bg-gray-400/20 text-gray-300":i===2?"bg-orange-500/20 text-orange-400":"bg-white/10 text-white/50"}`}>{i+1}</div></td>
              <td className="py-2 px-2"><Link href={`/teams/${team.id}`} className="flex items-center gap-2 group"><TeamLogo name={team.shortName} size="sm" /><div><div className="font-bold text-white group-hover:text-purple-300">{team.shortName}</div><div className="text-[10px] text-white/30">{team.region}</div></div></Link></td>
              <td className="py-2 px-2 text-center font-bold text-gradient-green">#{team.worldRanking}</td>
              <td className="py-2 px-2 text-center text-white/70">#{team.recentRanking}</td>
              <td className="py-2 px-2 text-center text-white/70">{team.teamRating.toFixed(2)}</td>
              <td className="py-2 px-2 text-center"><span className={`font-medium ${team.winrate5>=0.6?"text-green-400":team.winrate5>=0.5?"text-yellow-400":"text-red-400"}`}>{Math.round(team.winrate5*100)}%</span></td>
              <td className="py-2 px-2 text-center"><span className={`font-medium ${team.winrate10>=0.6?"text-green-400":team.winrate10>=0.5?"text-yellow-400":"text-red-400"}`}>{Math.round(team.winrate10*100)}%</span></td>
              <td className="py-2 px-2 text-center text-white/60">{Math.round(team.lanWinrate*100)}%</td>
              <td className="py-2 px-2 text-center text-white/60">{Math.round(team.bo3Winrate*100)}%</td>
              <td className="py-2 px-2 text-center text-white/40">{team.totalMatches}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      <div className="glass rounded-xl p-5">
        <h2 className="text-lg font-bold mb-3 text-gradient">📊 vs Топ-команды</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sorted.map((team: any) => (
            <div key={team.id} className="glass rounded-lg p-3 border border-white/5">
              <div className="flex justify-between mb-2"><Link href={`/teams/${team.id}`} className="font-bold text-white text-sm hover:text-purple-300">{team.shortName}</Link><span className="text-[10px] text-white/40">#{team.worldRanking}</span></div>
              <div className="space-y-1.5">
                {[["vs Top 5", team.vsTop5Winrate, "green"], ["vs Top 10", team.vsTop10Winrate, "blue"], ["vs Top 20", team.vsTop20Winrate, "purple"]].map(([l, v, c]: any, i: number) => (
                  <div key={i}><div className="flex justify-between text-[10px]"><span className="text-white/50">{l}</span><span className={`font-medium ${v>=0.55?"text-green-400":"text-red-400"}`}>{Math.round(v*100)}%</span></div>
                    <div className="w-full bg-white/10 rounded-full h-1 mt-0.5"><div className={`bg-${c}-500 h-1 rounded-full`} style={{ width: `${v*100}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
