import { getAllMatches, getH2H, getTeamById } from "@/data/mockData";
import { calculatePrediction } from "@/lib/prediction/model";
import { generateExplanation, generateShortPrediction } from "@/lib/ai/explanation";
import Link from "next/link";
import { Badge, ConfidenceIndicator, ProgressBar, TeamLogo } from "@/components/ui/Card";

export function MatchCard({ match }: { match: ReturnType<typeof getAllMatches>[0] }) {
  const prediction = calculatePrediction(match);
  const importanceColors: Record<string, "default" | "success" | "warning" | "danger" | "info"> = { low: "default", medium: "info", high: "warning", very_high: "danger" };
  const fmtTime = (d: string) => new Date(d).toLocaleString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Krasnoyarsk" }) + " (KRAT)";

  return (
    <Link href={`/matches/${match.id}`}>
      <div className="glass rounded-xl p-5 hover:bg-white/[0.08] transition-all cursor-pointer group border border-white/10 hover:border-purple-500/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant={importanceColors[match.importance] || "default"}>{match.tournament}</Badge>
            {match.stage && <Badge>{match.stage}</Badge>}
          </div>
          <span className="text-xs text-white/40">{fmtTime(match.startTime)}</span>
        </div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex-1 text-right">
            <div className="flex items-center justify-end gap-2 mb-1">
              <div><h3 className="font-bold text-white group-hover:text-purple-300 transition-colors">{match.teamA.shortName}</h3>
              <p className="text-[10px] text-white/40">#{match.teamA.worldRanking}</p></div>
              <TeamLogo name={match.teamA.shortName} size="md" />
            </div>
            <div className="text-2xl font-bold text-gradient-green">{prediction.teamAWinProbability}%</div>
          </div>
          <div className="flex flex-col items-center gap-1"><span className="text-white/20 font-bold">VS</span><Badge variant="info">{match.format}</Badge></div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <TeamLogo name={match.teamB.shortName} size="md" />
              <div><h3 className="font-bold text-white group-hover:text-purple-300 transition-colors">{match.teamB.shortName}</h3>
              <p className="text-[10px] text-white/40">#{match.teamB.worldRanking}</p></div>
            </div>
            <div className="text-2xl font-bold text-gradient-gold">{prediction.teamBWinProbability}%</div>
          </div>
        </div>
        <div className="flex h-1.5 rounded-full overflow-hidden bg-white/10">
          <div className="bg-gradient-to-r from-green-600 to-green-400 transition-all" style={{ width: `${prediction.teamAWinProbability}%` }} />
          <div className="bg-gradient-to-r from-orange-400 to-orange-600 transition-all" style={{ width: `${prediction.teamBWinProbability}%` }} />
        </div>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
          <ConfidenceIndicator level={prediction.confidence} />
          <span className="text-[10px] text-white/40 max-w-[55%] truncate">{prediction.mainFactors[0] || "Анализ..."}</span>
        </div>
      </div>
    </Link>
  );
}

export function MatchList({ matches, title }: { matches: ReturnType<typeof getAllMatches>; title?: string }) {
  if (!matches.length) return <div className="text-center py-12 text-white/40">Нет матчей</div>;
  return (
    <div>
      {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {matches.map(m => <MatchCard key={m.id} match={m} />)}
      </div>
    </div>
  );
}
