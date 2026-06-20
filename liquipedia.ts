"use client";
import { getAllMatches } from "@/data/mockData";
import { MatchList } from "@/components/match/MatchCard";
import { useState, useMemo } from "react";

export default function MatchesPage() {
  const matches = getAllMatches();
  const [filterTournament, setFilterTournament] = useState("all");
  const [filterFormat, setFilterFormat] = useState("all");
  const tournaments = useMemo(() => [...new Set(matches.map(m => m.tournament))], []);

  const filtered = useMemo(() => matches.filter(m => {
    if (filterTournament !== "all" && m.tournament !== filterTournament) return false;
    if (filterFormat !== "all" && m.format !== filterFormat) return false;
    return true;
  }), [matches, filterTournament, filterFormat]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-gradient">🎮 Все матчи</h1>
      <div className="glass rounded-xl p-4 flex flex-wrap gap-4">
        <div><label className="text-[10px] text-white/40 block mb-1">Турнир</label>
          <select value={filterTournament} onChange={e => setFilterTournament(e.target.value)} className="bg-white/5 border border-white/10 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500">
            <option value="all">Все</option>{tournaments.map(t => <option key={t} value={t}>{t}</option>)}
          </select></div>
        <div><label className="text-[10px] text-white/40 block mb-1">Формат</label>
          <select value={filterFormat} onChange={e => setFilterFormat(e.target.value)} className="bg-white/5 border border-white/10 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500">
            <option value="all">Все</option><option value="BO1">BO1</option><option value="BO3">BO3</option><option value="BO5">BO5</option>
          </select></div>
        <div><label className="text-[10px] text-white/40 block mb-1">Найдено</label><div className="px-3 py-1.5 text-sm text-white/50">{filtered.length}</div></div>
      </div>
      <MatchList matches={filtered} />
    </div>
  );
}
