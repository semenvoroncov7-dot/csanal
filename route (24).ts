import { getAllTeams, getTeamById } from "@/data/mockData";
import { TeamLogo, Badge, ProgressBar } from "@/components/ui/Card";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() { return getAllTeams().map(t => ({ id: t.id })); }

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const p = await params;
  const team = getTeamById(p.id);
  if (!team) return notFound();
  const maps = ["Mirage", "Inferno", "Nuke", "Ancient", "Anubis", "Dust2", "Train"];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-white/40">
        <Link href="/" className="hover:text-white/70">Главная</Link><span>/</span>
        <Link href="/teams" className="hover:text-white/70">Команды</Link><span>/</span>
        <span className="text-white/70">{team.name}</span>
      </div>
      <div className="glass rounded-xl p-6 glow-purple">
        <div className="flex items-center gap-4 mb-4"><TeamLogo name={team.shortName} size="lg" />
          <div><h1 className="text-2xl font-black text-gradient">{team.name}</h1>
          <p className="text-sm text-white/40">{team.region} • {team.country} • Тренер: {team.coach || "—"}</p></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center"><div className="text-xl font-bold text-gradient-green">#{team.worldRanking}</div><div className="text-[10px] text-white/40">Мировой</div></div>
          <div className="text-center"><div className="text-xl font-bold text-gradient-gold">#{team.recentRanking}</div><div className="text-[10px] text-white/40">3 мес.</div></div>
          <div className="text-center"><div className="text-xl font-bold text-gradient-blue">{team.teamRating.toFixed(2)}</div><div className="text-[10px] text-white/40">Рейтинг</div></div>
          <div className="text-center"><div className="text-xl font-bold text-gradient">{team.totalMatches}</div><div className="text-[10px] text-white/40">Матчей</div></div>
        </div>
      </div>

      <div className="glass rounded-xl p-5">
        <h2 className="text-lg font-bold mb-3 text-gradient-blue">👤 Состав</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {team.players.map(p => (
            <Link key={p.id} href={`/players/${p.id}`} className="block">
              <div className="glass rounded-lg p-3 hover:bg-white/[0.08] transition-all">
                <div className="flex items-center gap-2 mb-2"><TeamLogo name={p.nickname} size="sm" />
                  <div><h3 className="font-bold text-white text-sm">{p.nickname}</h3><p className="text-[10px] text-white/40">{p.realName}</p></div>
                  {p.standIn && <Badge variant="danger">Stand-in</Badge>}
                </div>
                <div className="grid grid-cols-4 gap-1 text-[10px]"><div className="text-green-400 font-bold">{p.rating.toFixed(2)}<br/><span className="text-white/40">Rating</span></div>
                  <div className="text-white/70">{p.kd.toFixed(2)}<br/><span className="text-white/40">K/D</span></div>
                  <div className="text-white/70">{p.adr.toFixed(0)}<br/><span className="text-white/40">ADR</span></div>
                  <div className="text-white/70">{p.impact.toFixed(2)}<br/><span className="text-white/40">Impact</span></div>
                </div>
                <p className="text-[10px] text-white/30 mt-1 capitalize">{p.role}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="glass rounded-xl p-5">
        <h2 className="text-lg font-bold mb-3 text-gradient-gold">📈 Форма</h2>
        <div className="flex gap-1.5 mb-3">{team.recentForm.map((m, i) => (
          <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${m.result==="W"?"bg-green-500/20 text-green-400":m.result==="L"?"bg-red-500/20 text-red-400":"bg-yellow-500/20 text-yellow-400"}`}>{m.result}</div>
        ))}</div>
        <div className="space-y-1">{team.recentForm.slice(0,5).map((m,i) => (
          <div key={i} className="flex justify-between text-xs py-1 px-2 bg-white/5 rounded"><span className="text-white/40">{m.date} • {m.tournament}</span><span className={m.result==="W"?"text-green-400":"text-red-400"}>{m.result==="W"?"✓":"✗"} {m.score} vs {m.opponent}</span></div>
        ))}</div>
      </div>

      <div className="glass rounded-xl p-5">
        <h2 className="text-lg font-bold mb-3 text-gradient">🗺️ Карты</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {maps.map(mapName => {
            const s = (team.mapStats as any)[mapName];
            if (!s) return null;
            return (
              <div key={mapName} className="glass rounded-lg p-3 border border-white/5">
                <div className="flex justify-between mb-1"><h3 className="font-bold text-white text-sm">{mapName}</h3>
                  <span className={`text-xs font-bold ${s.winRate>=0.6?"text-green-400":s.winRate>=0.5?"text-yellow-400":"text-red-400"}`}>{Math.round(s.winRate*100)}%</span></div>
                <ProgressBar value={s.winRate*100} color={s.winRate>=0.6?"green":s.winRate>=0.5?"yellow":"red"} />
                <div className="flex justify-between mt-1 text-[10px] text-white/40"><span>{s.matchesPlayed} матчей</span><span>Пик: {Math.round(s.pickRate*100)}% • Бан: {Math.round(s.banRate*100)}%</span></div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass rounded-xl p-5"><h3 className="font-bold mb-2 text-green-400 text-sm">✅ Сильные стороны</h3>
          <ul className="space-y-1 text-xs text-white/70">
            {maps.map(mapName => { const s = (team.mapStats as any)[mapName]; return s && s.winRate >= 0.65 ? <li key={mapName}>🗺️ {mapName} — {Math.round(s.winRate*100)}% ({s.matchesPlayed} м)</li> : null; }).filter(Boolean)}
            {team.lanWinrate > 0.65 && <li>🌐 LAN: {Math.round(team.lanWinrate*100)}%</li>}
            {team.bo3Winrate > 0.65 && <li>🎮 BO3: {Math.round(team.bo3Winrate*100)}%</li>}
          </ul>
        </div>
        <div className="glass rounded-xl p-5"><h3 className="font-bold mb-2 text-red-400 text-sm">❌ Слабые стороны</h3>
          <ul className="space-y-1 text-xs text-white/70">
            {maps.map(mapName => { const s = (team.mapStats as any)[mapName]; return s && s.winRate < 0.55 && s.matchesPlayed > 5 ? <li key={mapName}>🗺️ {mapName} — {Math.round(s.winRate*100)}%</li> : null; }).filter(Boolean)}
            {team.bo1Winrate < 0.6 && <li>🎲 BO1: {Math.round(team.bo1Winrate*100)}%</li>}
            {team.winrate5 < 0.5 && <li>📉 WR5: {Math.round(team.winrate5*100)}%</li>}
          </ul>
        </div>
      </div>

      {team.historyChanges.length > 0 && (
        <div className="glass rounded-xl p-5"><h3 className="font-bold mb-3 text-gradient text-sm">📋 История состава</h3>
          <div className="space-y-1">{team.historyChanges.map((c, i) => (
            <div key={i} className="flex justify-between py-1.5 px-2 bg-white/5 rounded text-xs"><span className="text-white/40">{c.date}</span><span className="text-white/70">{c.description}</span><Badge variant={c.type==="roster_update"?"info":"warning"}>{c.type}</Badge></div>
          ))}</div>
        </div>
      )}
    </div>
  );
}
