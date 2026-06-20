import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "CS2 Analytics — Прогнозы и аналитика матчей",
  description: "Аналитическая платформа для матчей по Counter-Strike 2",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎮</text></svg>" />
      </head>
      <body className="min-h-screen bg-[#0a0a0f] text-white">
        <div className="flex flex-col min-h-screen">
          <header className="sticky top-0 z-50 bg-white/5 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-blue-500 rounded-md flex items-center justify-center text-white text-xs font-bold">CS</div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">CS2 Analytics</span>
              </Link>
              <nav className="hidden md:flex items-center gap-1">
                {[
                  { href: "/", label: "🏠 Главная" },
                  { href: "/matches", label: "🎮 Матчи" },
                  { href: "/teams", label: "👥 Команды" },
                  { href: "/rankings", label: "🏆 Рейтинг" },
                  { href: "/analytics", label: "📊 Аналитика" },
                  { href: "/about", label: "ℹ️ О проекте" },
                ].map(item => (
                  <Link key={item.href} href={item.href} className="px-3 py-1.5 rounded-md text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                    {item.label}
                  </Link>
                ))}
              </nav>
              <Link href="/admin" className="text-sm text-purple-400 hover:text-purple-300 px-3 py-1.5 rounded-md hover:bg-purple-500/10 transition-colors">⚙️ Админ</Link>
            </div>
          </header>
          <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">{children}</main>
          <footer className="border-t border-white/10 mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <p className="text-xs text-white/40 text-center">
                ⚠️ Прогнозы являются аналитической оценкой на основе статистики. Не гарантируют исход матча и не являются финансовой рекомендацией.
              </p>
              <p className="text-xs text-white/30 text-center mt-2">© 2026 CS2 Analytics MVP</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
