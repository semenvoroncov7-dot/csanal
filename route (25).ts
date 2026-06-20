import { getAllTeams } from "@/data/mockData";
import { TeamLogo, Badge } from "@/components/ui/Card";
import Link from "next/link";

export default function TeamsPage() {
  const teams = getAllTeams();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-gradient">👥 Команды</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map(team => (
          <Link key={team.id} href={`/teams/${team.id}`}>
            <div className="glass rounded-xl p-5 hover:bg-white/[0.08] transition-all group border border-white/10 hover:border-purple-500/30">
              <div className="flex items-center gap-3 mb-3">
                <TeamLogo name={team.shortName} size="lg" />
                <div><h3 className="font-bold text-white group-hover:text-purple-300 transition-colors">{team.name}</h3>
                <p className="text-xs text-white/40">{team.region} • {team.country}</p></div>
              </div>
              <div className="flex items-center justify-between mb-3">
                <div className="text-center"><div className="text-xl font-bold text-gradient-green">#{team.worldRanking}</div><div className="text-[10px] text-white/40">Мировой</div></div>
                <div className="text-center"><div className="text-xl font-bold text-gradient-gold">{team.teamRating.toFixed(2)}</div><div className="text-[10px] text-white/40">Рейтинг</div></div>
                <div className="text-center"><div className="text-xl font-bold text-gradient-blue">{team.players.length}</div><div className="text-[10px] text-white/40">Игроков</div></div>
              </div>
              <div className="flex flex-wrap gap-1">
                <Badge variant="success">WR5: {Math.round(team.winrate5*100)}%</Badge>
                <Badge variant="info">LAN: {Math.round(team.lanWinrate*100)}%</Badge>
                <Badge variant="warning">BO3: {Math.round(team.bo3Winrate*100)}%</Badge>
              </div>
              <p className="text-[10px] text-white/30 mt-2">Тренер: {team.coach || "—"}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
