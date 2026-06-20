import { getMatchById, getAllMatches } from "@/data/mockData";
import { MatchDetail } from "@/components/match/MatchDetail";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() { return getAllMatches().map(m => ({ id: m.id })); }
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const p = await params;
  const match = getMatchById(p.id);
  if (!match) return { title: "Не найден" };
  return { title: `${match.teamA.shortName} vs ${match.teamB.shortName} — ${match.tournament}` };
}

export default async function MatchPage({ params }: { params: Promise<{ id: string }> }) {
  const p = await params;
  const match = getMatchById(p.id);
  if (!match) return notFound();
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs text-white/40">
        <Link href="/" className="hover:text-white/70">Главная</Link><span>/</span>
        <Link href="/matches" className="hover:text-white/70">Матчи</Link><span>/</span>
        <span className="text-white/70">{match.teamA.shortName} vs {match.teamB.shortName}</span>
      </div>
      <MatchDetail match={match} />
    </div>
  );
}
