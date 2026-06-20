export function Card({ children, className = "", glow = "" }: { children: React.ReactNode; className?: string; glow?: string }) {
  return <div className={`glass rounded-xl p-5 ${className} ${glow}`}>{children}</div>;
}
export function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "success" | "warning" | "danger" | "info" }) {
  const v = { default: "bg-white/10 text-white/70", success: "bg-green-500/20 text-green-400", warning: "bg-yellow-500/20 text-yellow-400", danger: "bg-red-500/20 text-red-400", info: "bg-blue-500/20 text-blue-400" };
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${v[variant]}`}>{children}</span>;
}
export function ProgressBar({ value, color = "purple", showLabel = true }: { value: number; color?: string; showLabel?: boolean }) {
  const c = { purple: "bg-purple-500", blue: "bg-blue-500", green: "bg-green-500", orange: "bg-orange-500", red: "bg-red-500", yellow: "bg-yellow-500" } as any;
  return (
    <div className="w-full">
      {showLabel && <div className="flex justify-between mb-1"><span className="text-xs text-white/50">{Math.round(value)}%</span></div>}
      <div className="w-full bg-white/10 rounded-full h-2"><div className={`h-2 rounded-full transition-all duration-500 ${c[color] || c.purple}`} style={{ width: `${Math.min(100, value)}%` }} /></div>
    </div>
  );
}
export function ConfidenceIndicator({ level }: { level: "low" | "medium" | "high" }) {
  const c = { low: { emoji: "🔴", label: "Низкая", color: "text-red-400" }, medium: { emoji: "🟡", label: "Средняя", color: "text-yellow-400" }, high: { emoji: "🟢", label: "Высокая", color: "text-green-400" } };
  const { emoji, label, color } = c[level];
  return <div className="flex items-center gap-1.5"><span>{emoji}</span><span className={`text-xs font-medium ${color}`}>{label}</span></div>;
}
export function TeamLogo({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const s = { sm: "w-7 h-7 text-xs", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-lg" };
  return <div className={`${s[size]} rounded-lg bg-white/5 flex items-center justify-center border border-white/10`}><span className="font-bold text-white/80">{name.charAt(0).toUpperCase()}</span></div>;
}
export function MapBadge({ map, advantage }: { map: string; advantage?: "a" | "b" | "neutral" }) {
  const c = { a: "border-green-500/50 bg-green-500/10 text-green-400", b: "border-red-500/50 bg-red-500/10 text-red-400", neutral: "border-white/10 bg-white/5 text-white/60" };
  return <span className={`px-2 py-0.5 rounded text-xs font-medium border ${c[advantage || "neutral"]}`}>{map}</span>;
}
