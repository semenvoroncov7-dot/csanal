import { getUpcomingMatches } from "@/data/mockData";
import { MatchList } from "@/components/match/MatchCard";
import Link from "next/link";

export default function HomePage() {
  const matches = getUpcomingMatches();
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-transparent rounded-2xl" />
        <div className="relative z-10 text-center py-14 px-4">
          <h1 className="text-4xl md:text-6xl font-black mb-3"><span className="text-gradient">CS2 Analytics</span></h1>
          <p className="text-lg text-white/60 max-w-xl mx-auto mb-6">Аналитика и прогнозы матчей по Counter-Strike 2 на основе статистики и интеллектуальной модели</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/matches" className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all">🎮 Все матчи</Link>
            <Link href="/teams" className="px-5 py-2.5 glass hover:bg-white/10 text-white rounded-lg font-medium transition-all">👥 Команды</Link>
            <Link href="/analytics" className="px-5 py-2.5 glass hover:bg-white/10 text-white rounded-lg font-medium transition-all">📊 Аналитика</Link>
            <Link href="/rankings" className="px-5 py-2.5 glass hover:bg-white/10 text-white rounded-lg font-medium transition-all">🏆 Рейтинг</Link>
          </div>
        </div>
      </section>
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[["6","Команд"],["5","Матчей"],["7","Карт"],["30+","Факторов"]].map(([v,l],i) => (
          <div key={i} className="glass rounded-xl p-4 text-center"><div className="text-xl font-bold text-gradient">{v}</div><div className="text-xs text-white/50 mt-1">{l}</div></div>
        ))}
      </section>
      <section>
        <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-bold">🔥 Ближайшие матчи</h2><Link href="/matches" className="text-purple-400 hover:text-purple-300 text-sm">Смотреть все →</Link></div>
        <MatchList matches={matches} />
      </section>
      <section className="glass rounded-xl p-6">
        <h2 className="text-lg font-bold mb-3 text-gradient">🧠 Методология</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><h3 className="font-bold text-green-400 mb-1 text-sm">📊 Статистика</h3><p className="text-xs text-white/60">30+ показателей: рейтинг, форма, карты, K/D, ADR, impact</p></div>
          <div><h3 className="font-bold text-blue-400 mb-1 text-sm">🤖 Модель</h3><p className="text-xs text-white/60">Настраиваемые веса, сигмоидальная конвертация, коррекция по формату</p></div>
          <div><h3 className="font-bold text-purple-400 mb-1 text-sm">💡 Объяснение</h3><p className="text-xs text-white/60">Каждый прогноз с текстовым объяснением и рисками</p></div>
        </div>
      </section>
    </div>
  );
}
