/**
 * Адаптер для HLTV.org
 * MVP — заглушка с mock-данными.
 * В продакшене: интеграция через официальный API или легальный парсинг.
 */
import { Team, Match, DataSource } from "@/types";
import { mockTeams, mockMatches } from "@/data/mockData";

const CACHE: Record<string, { data: any; timestamp: number }> = {};
const CACHE_TTL = 3600 * 1000;

function getCached<T>(key: string): T | null {
  const entry = CACHE[key];
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) return entry.data as T;
  return null;
}

function setCache(key: string, data: any) { CACHE[key] = { data, timestamp: Date.now() }; }

export async function fetchHLTVTeam(id: string): Promise<Team | null> {
  const cached = getCached<Team>(`hltv_team_${id}`);
  if (cached) return cached;
  const team = mockTeams.find(t => t.id === id);
  if (team) { setCache(`hltv_team_${id}`, team); return team; }
  return null;
}

export async function fetchHLTVMatches(): Promise<Match[]> {
  const cached = getCached<Match[]>("hltv_matches");
  if (cached) return cached;
  setCache("hltv_matches", mockMatches);
  return mockMatches;
}

export function getHLTVSource(): DataSource {
  return { name: "HLTV", url: "https://www.hltv.org", lastUpdated: new Date().toISOString(), dataCompleteness: 85 };
}
