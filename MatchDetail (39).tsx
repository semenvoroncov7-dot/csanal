/**
 * Адаптер для BO3.gg — заглушка MVP
 */
import { DataSource } from "@/types";
export function getBO3GGSource(): DataSource {
  return { name: "BO3.gg", url: "https://bo3.gg", lastUpdated: new Date().toISOString(), dataCompleteness: 80 };
}
