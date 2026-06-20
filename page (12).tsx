import { NextResponse } from "next/server";
import { getAllMatches } from "@/data/mockData";
import { calculatePrediction } from "@/lib/prediction/model";

export async function GET() {
  try {
    const matches = getAllMatches();
    const result = matches.map(m => ({
      matchId: m.id, teamA: m.teamA.name, teamB: m.teamB.name,
      tournament: m.tournament, stage: m.stage, startTime: m.startTime,
      format: m.format, isLan: m.isLan, status: m.status,
      prediction: calculatePrediction(m),
    }));
    return NextResponse.json({ matches: result });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch matches" }, { status: 500 });
  }
}
