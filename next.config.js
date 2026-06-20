import { getAllTeams } from "@/data/mockData";
import { TeamLogo, Badge, ProgressBar } from "@/components/ui/Card";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() { return getAllTeams().flatMap(t => t.players.map(p => ({ id: p.id }))); }

export default async function PlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const p = await params;
  let playerWithTeam: { player: any; team: any } | null = null;
  for (const team of getAllTeams()) {
    const pl = team.players.find(x => x.id === p.id);
    if (pl) { playerWithTeam = { player: pl, team }; break; }
  }
  if (!playerWithTeam) return notFound();
  const { player, team } = playerWithTeam;
  const roleEmojis: Record<string, string> = { awper: "🎯", rifler: "🔫", igl: "🧠", support: "🛡️", entry: "⚡", lurker: "👻" };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-white/40">
        <Link href="/" className="hover:text-white/70">Главная</Link><span>/</span>
        <Link href="/players" className="hover:text-white/70">Игроки</Link><span>/</span>
        <span className="text-white/70">{player.nickname}</span>
      </div>
      <div className="glass rounded-xl p-6 glow-blue">
        <div className="flex items-center gap-4 mb-4"><TeamLogo name={player.nickname} size="lg" />
          <div><h1 className="text-2xl font-black text-gradient-blue">{player.nickname}</h1>
          <p className="text-sm text-white/40">{player.realName || "—"} • {player.country || "—"}</p>
          <div className="flex items-center gap-2 mt-1"><Badge variant="info">{roleEmojis[player.role] || ""} {player.role}</Badge>
            <Link href={`/teams/${team.id}`}><Badge>{team.shortName} #{team.worldRanking}</Badge></Link>
            {player.standIn && <Badge variant="danger">Stand-in</Badge>}
          </div></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[["Rating", player.rating.toFixed(2), "green"], ["K/D", player.kd.toFixed(2), "blue"], ["ADR", player.adr.toFixed(1), "purple"], ["Impact", player.impact.toFixed(2), "orange"], ["HS%", player.headshotPercentage + "%", "yellow"]].map(([l, v, c], i) => (
            <div key={i} className="glass rounded-lg p-3 text-center"><div className={`text-lg font-bold text-${c}-400`}>{v}</div><div className="text-[10px] text-white/40">{l as string}</div></div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass rounded-xl p-5"><h3 className="font-bold mb-3 text-gradient-gold text-sm">🛡️ Clutch</h3>
          <div className="space-y-2"><div className="flex justify-between text-sm"><span className="text-white/50">Winrate</span><span className="font-bold text-white">{(player.clutchRate*100).toFixed(1)}%</span></div>
          <ProgressBar value={player.clutchRate*100} color="green" /></div>
        </div>
        <div className="glass rounded-xl p-5"><h3 className="font-bold mb-3 text-gradient-green text-sm">⚡ Opening</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-white/50">Kill Rate</span><span className="font-bold text-white">{(player.openingKillRate*100).toFixed(1)}%</span></div>
            <ProgressBar value={player.openingKillRate*100} color="blue" />
            <div className="flex justify-between text-sm"><span className="text-white/50">Death Rate</span><span className="font-bold text-white">{(player.firstDeathRate*100).toFixed(1)}%</span></div>
            <ProgressBar value={player.firstDeathRate*100} color="red" />
          </div>
        </div>
      </div>
      <div className="glass rounded-xl p-5">
        <h3 className="font-bold mb-3 text-gradient text-sm">📈 Форма</h3>
        {player.recentForm?.length > 0 ? (<>
          <div className="flex gap-1.5 mb-3">{player.recentForm.map((r: number, i: number) => (
            <div key={i} className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${r>=1.2?"bg-green-500/20 text-green-400":r>=1?"bg-blue-500/20 text-blue-400":r>=0.9?"bg-yellow-500/20 text-yellow-400":"bg-red-500/20 text-red-400"}`}>{r.toFixed(2)}</div>
          ))}</div>
          <div className="flex justify-between text-sm"><span className="text-white/50">Средняя:</span><span className="font-bold text-white">{(player.recentForm.reduce((a: number, b: number) => a + b, 0) / player.recentForm.length).toFixed(2)}</span></div>
          <div className="flex justify-between text-sm mt-1"><span className="text-white/50">Стабильность:</span><span className="font-bold text-white">{(player.stability*100).toFixed(0)}%</span></div>
        </>) : <p className="text-white/40 text-sm">Нет данных</p>}
      </div>
      {player.awpImpact !== undefined && (
        <div className="glass rounded-xl p-5"><h3 className="font-bold mb-3 text-gradient-blue text-sm">🎯 AWP</h3>
          <div className="flex justify-between text-sm"><span className="text-white/50">AWP Impact</span><span className="text-xl font-bold text-gradient-blue">{player.awpImpact.toFixed(2)}</span></div>
        </div>
      )}
    </div>
  );
}
