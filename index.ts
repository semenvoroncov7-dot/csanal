@import "tailwindcss";

:root {
  --bg: #0a0a0f;
  --card: rgba(255,255,255,0.05);
  --card-border: rgba(255,255,255,0.1);
  --purple: #8b5cf6;
  --blue: #3b82f6;
  --green: #22c55e;
  --red: #ef4444;
  --yellow: #f59e0b;
  --orange: #f97316;
}

body { background: var(--bg); color: white; }
.glass { background: var(--card); backdrop-filter: blur(12px); border: 1px solid var(--card-border); }
.glass-strong { background: rgba(255,255,255,0.1); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.15); }
.text-gradient { background: linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.text-gradient-green { background: linear-gradient(to right, #22c55e, #10b981); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.text-gradient-gold { background: linear-gradient(to right, #f59e0b, #f97316); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.text-gradient-blue { background: linear-gradient(to right, #3b82f6, #6366f1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.glow-purple { box-shadow: 0 0 30px rgba(139,92,246,0.3); }
.glow-blue { box-shadow: 0 0 30px rgba(59,130,246,0.3); }
.glow-green { box-shadow: 0 0 30px rgba(16,185,129,0.3); }

input[type="range"] { -webkit-appearance: none; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; outline: none; }
input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; background: #8b5cf6; border-radius: 50%; cursor: pointer; }
select { -webkit-appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='white' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 8px center; padding-right: 28px; }
a { color: inherit; text-decoration: none; }
