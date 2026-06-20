"use client";
import { Badge, ProgressBar } from "@/components/ui/Card";
import { useState } from "react";

export default function SettingsPage() {
  const [weights, setWeights] = useState({ teamStrength: 0.20, recentForm: 0.15, mapPool: 0.20, playerForm: 0.15, h2h: 0.07, context: 0.13, market: 0.10 });
  const [bo1F, setBo1F] = useState(0.25);
  const [bo5F, setBo5F] = useState(0.15);
  const total = Object.values(weights).reduce((s, v) => s + v, 0);
  const labels: Record<string, string> = { teamStrength: "Общая сила команды", recentForm: "Текущая форма", mapPool: "Карты и veto", playerForm: "Форма игроков", h2h: "Личные встречи", context: "Контекст матча", market: "Рыночные данные" };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-gradient">⚙️ Настройки модели</h1>
      <div className="glass rounded-xl p-6">
        <h2 className="text-lg font-bold mb-2 text-gradient">⚖️ Веса факторов</h2>
        <p className="text-xs text-white/50 mb-4">Сумма: <span className={`font-bold ${Math.abs(total-1)<0.01?"text-green-400":"text-red-400"}`}>{Math.round(total*100)}%</span></p>
        <div className="space-y-3">{Object.entries(weights).map(([k, v]) => (
          <div key={k} className="flex items-center gap-3"><label className="text-xs text-white/70 w-44">{labels[k]}</label>
            <input type="range" min="0" max="0.3" step="0.01" value={v} onChange={e => setWeights({...weights, [k]: parseFloat(e.target.value)})} className="flex-1" />
            <span className="text-xs font-bold text-white w-10 text-right">{Math.round(v*100)}%</span></div>
        ))}</div>
      </div>
      <div className="glass rounded-xl p-6">
        <h2 className="text-lg font-bold mb-2 text-gradient-gold">🎮 Формат</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3"><label className="text-xs text-white/70 w-32">BO1 рандом</label>
            <input type="range" min="0" max="0.5" step="0.01" value={bo1F} onChange={e => setBo1F(parseFloat(e.target.value))} className="flex-1" />
            <span className="text-xs font-bold text-white w-10 text-right">{Math.round(bo1F*100)}%</span></div>
          <div className="flex items-center gap-3"><label className="text-xs text-white/70 w-32">BO5 сила</label>
            <input type="range" min="0" max="0.3" step="0.01" value={bo5F} onChange={e => setBo5F(parseFloat(e.target.value))} className="flex-1" />
            <span className="text-xs font-bold text-white w-10 text-right">{Math.round(bo5F*100)}%</span></div>
        </div>
      </div>
      <div className="flex gap-2"><button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm">💾 Сохранить</button><button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm">🔄 Сброс</button></div>
    </div>
  );
}
