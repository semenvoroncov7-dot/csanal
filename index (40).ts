/**
 * Адаптер для Liquipedia — заглушка MVP
 */
import { DataSource } from "@/types";
export function getLiquipediaSource(): DataSource {
  return { name: "Liquipedia", url: "https://liquipedia.net/counterstrike", lastUpdated: new Date().toISOString(), dataCompleteness: 88 };
}
