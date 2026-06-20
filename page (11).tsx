import { NextResponse } from "next/server";
import { getMatchById } from "@/data/mockData";
import { calculatePrediction } from "@/lib/prediction/model";
import { generateExplanation } from "@/lib/ai/explanation";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const match = getMatchById(params.id);
    if (!match) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const prediction = calculatePrediction(match);
    const explanation = generateExplanation(prediction, match.teamA, match.teamB, match);
    return NextResponse.json({ matchId: match.id, teamA: match.teamA.name, teamB: match.teamB.name, prediction: { ...prediction, explanation }, sources: match.sources, lastDataUpdate: match.lastDataUpdate });
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
