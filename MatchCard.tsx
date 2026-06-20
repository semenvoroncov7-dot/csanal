import { NextResponse } from "next/server";
import { getTeamById } from "@/data/mockData";
import { calculatePrediction } from "@/lib/prediction/model";
import { generateExplanation } from "@/lib/ai/explanation";
import { Match } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { teamAId, teamBId, format, isLan } = body;
    const teamA = getTeamById(teamAId);
    const teamB = getTeamById(teamBId);
    if (!teamA || !teamB) return NextResponse.json({ error: "Team not found" }, { status: 404 });
    const mockMatch: Match = {
      id: "api_manual", teamA, teamB,
      tournament: body.tournament || "Custom", stage: "Custom",
      startTime: new Date().toISOString(),
      format: (format || "BO3") as Match["format"],
      isLan: isLan !== undefined ? isLan : true,
      region: "Unknown", importance: "medium" as const,
      status: "upcoming" as const,
      sources: [{ name: "API", url: "", lastUpdated: new Date().toISOString(), dataCompleteness: 100 }],
      lastDataUpdate: new Date().toISOString(),
    };
    const prediction = calculatePrediction(mockMatch);
    const explanation = generateExplanation(prediction, teamA, teamB, mockMatch);
    return NextResponse.json({
      matchId: mockMatch.id, teamA: teamA.name, teamB: teamB.name,
      prediction: {
        teamAWinProbability: prediction.teamAWinProbability,
        teamBWinProbability: prediction.teamBWinProbability,
        confidence: prediction.confidence,
        explanation,
        mainFactors: prediction.mainFactors,
        risks: prediction.risks,
        dataCompleteness: prediction.dataCompleteness,
      },
    });
  } catch (e) {
    return NextResponse.json({ error: "Failed to predict" }, { status: 500 });
  }
}
