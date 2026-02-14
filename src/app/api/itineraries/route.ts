import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import type { TripCreateInput } from "@/types/trip";

export async function POST(request: Request) {
  const body = (await request
    .json()
    .catch(() => null)) as TripCreateInput | null;
  if (!body) {
    return NextResponse.json({ error: "payload is required" }, { status: 400 });
  }

  const { title, prefecture, startDate, endDate } = body;
  const { data, error } = await supabaseServer
    .from("itineraries")
    .insert({
      title: title || null,
      pref_code: prefecture || null,
      start_date: startDate || null,
      end_date: endDate || null,
      people: 1,
    })
    .select("id")
    .single();

  if (error || !data?.id) {
    return NextResponse.json(
      { error: error?.message ?? "failed to create itinerary" },
      { status: 500 },
    );
  }

  return NextResponse.json({ id: data.id });
}
