import { NextResponse } from "next/server";
import { getAllTeams, getTeamById } from "@/data/mockData";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (id) {
      const team = getTeamById(id);
      if (!team) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json({ team });
    }
    return NextResponse.json({ teams: getAllTeams() });
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
