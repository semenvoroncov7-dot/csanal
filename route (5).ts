import Link from "next/link";
import { Badge } from "@/components/ui/Card";

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-gradient">ℹ️ О проекте</h1>
      <div className="glass rounded-xl p-6">
        <h2 className="text-xl font-bold mb-3 text-gradient">🎮 CS2 Analytics</h2>
        <p className="text-sm text-white/60 mb-3">Аналитическая платформа для матчей по Counter-Strike 2. Собираем данные из открытых источников, анализируем команды по 30+ факторам и выдаём прогноз с подробным объяснением.</p>
        <p className="text-sm text-white/60">Сервис не гарантирует исход матча. Прогнозы — аналитическая оценка, не финансовая рекомендация.</p>
      </div>
      <div className="glass rounded-xl p-6">
        <h2 className="text-lg font-bold mb-3 text-gradient-gold">📋 Факторы</h2>
        <div className="space-y-2">
          {[["Общая сила команды","20%","success"],["Карты и veto","20%","success"],["Текущая форма","15%","info"],["Форма игроков","15%","info"],["Контекст матча","13%","warning"],["Рыночные данные","10%","warning"],["Личные встречи","7%","default"]].map(([n,w,c],i) => (
            <div key={i} className="flex items-center justify-between py-1.5 px-3 bg-white/5 rounded text-sm"><span className="text-white/70">{n}</span><Badge variant={c as any}>{w}</Badge></div>
          ))}
        </div>
      </div>
      <div className="glass rounded-xl p-6">
        <h2 className="text-lg font-bold mb-3 text-gradient-blue">📡 Источники</h2>
        <div className="space-y-2">
          {[["HLTV.org","https://www.hltv.org","Основной источник статистики"],["Liquipedia","https://liquipedia.net/counterstrike","Составы и результаты"],["BO3.gg","https://bo3.gg","Доп. статистика"]].map(([n,u,d],i) => (
            <a key={i} href={u as string} target="_blank" rel="noopener noreferrer" className="block p-3 bg-white/5 rounded hover:bg-white/10 transition-colors"><div className="font-bold text-blue-400 text-sm">{n}</div><div className="text-xs text-white/50">{d}</div></a>
          ))}
        </div>
      </div>
      <div className="glass rounded-xl p-6 border border-yellow-500/20">
        <h2 className="text-lg font-bold mb-2 text-yellow-400">⚠️ Disclaimer</h2>
        <p className="text-xs text-yellow-400/70">Прогнозы являются аналитической оценкой на основе доступной статистики и открытых данных. Они не гарантируют исход матча и не являются финансовой или букмекерской рекомендацией.</p>
        <p className="text-xs text-yellow-400/60 mt-2">MVP использует mock-данные (тестовые), не отражающие реальную статистику.</p>
      </div>
      <div className="glass rounded-xl p-5">
        <h2 className="text-lg font-bold mb-3 text-gradient">🔗 Навигация</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[["🏠","Главная","/"],["🎮","Матчи","/matches"],["👥","Команды","/teams"],["👤","Игроки","/players"],["🏆","Рейтинги","/rankings"],["📊","Аналитика","/analytics"],["⚙️","Админ","/admin"],["⚖️","Веса","/settings/model"]].map(([e,l,u],i) => (
            <Link key={i} href={u as string} className="block p-3 bg-white/5 rounded hover:bg-white/10 transition-colors text-center text-sm text-white/70 hover:text-white">{e} {l}</Link>
          ))}
        </div>
      </div>
    </div>
  );
}
