import { NextResponse } from "next/server";
import { getAllTeams } from "@/data/mockData";

export async function GET() {
  try {
    const players = getAllTeams().flatMap(t => t.players.map(p => ({ ...p, team: t.shortName, teamId: t.id })));
    return NextResponse.json({ players });
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
