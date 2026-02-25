import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { nanoid } from "nanoid";
import type { ItineraryPublishArgs } from "@/types/publish";
import {
  toDayItemsInsert,
  toItineraryUpdate,
} from "@/lib/server/itinerary-publish-insert";

const SHARE_TTL_DAYS = 30;
const MAX_ID_RETRIES = 3;

const msFromDays = (days: number) => days * 24 * 60 * 60 * 1000;

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(request: Request, { params }: RouteParams) {
  const resolvedParams = await params;
  const itineraryId = resolvedParams.id;
  if (!itineraryId) {
    return NextResponse.json(
      { error: "itinerary id is required" },
      { status: 400 },
    );
  }

  const body = (await request
    .json()
    .catch(() => null)) as ItineraryPublishArgs | null;
  if (!body) {
    return NextResponse.json({ error: "payload is required" }, { status: 400 });
  }
  const args: ItineraryPublishArgs = {
    ...body,
    itinerary_id: itineraryId,
    items: Array.isArray(body.items) ? body.items : [],
  };
  console.log("[api/publish] args", {
    itinerary_id: args.itinerary_id,
    title: args.title,
    pref_code: args.pref_code,
    start_date: args.start_date,
    end_date: args.end_date,
    people_count: args.people_count,
    items_count: args.items.length,
  });

  const updateResult = await supabaseServer
    .from("itineraries")
    .update(toItineraryUpdate(args))
    .eq("id", itineraryId);
  console.log("[api/publish] itinerary update", { error: updateResult.error });
  if (updateResult.error) {
    return NextResponse.json(
      { error: updateResult.error.message },
      { status: 500 },
    );
  }

  const dayItemRows = toDayItemsInsert(args);
  console.log("[api/publish] dayItemRows", {
    count: dayItemRows.length,
    first: dayItemRows[0] ?? null,
  });

  // 既存の day_items を一度消して再登録する
  const deleteResult = await supabaseServer
    .from("day_items")
    .delete()
    .eq("itinerary_id", itineraryId);
  console.log("[api/publish] delete day_items", { error: deleteResult.error });
  if (deleteResult.error) {
    return NextResponse.json(
      { error: deleteResult.error.message },
      { status: 500 },
    );
  }

  if (dayItemRows.length > 0) {
    const insertDayItemsResult = await supabaseServer
      .from("day_items")
      .insert(dayItemRows);
    console.log("[api/publish] insert day_items", {
      error: insertDayItemsResult.error,
      inserted: dayItemRows.length,
    });
    if (insertDayItemsResult.error) {
      return NextResponse.json(
        { error: insertDayItemsResult.error.message },
        { status: 500 },
      );
    }
  }

  const expiresAt = new Date(
    Date.now() + msFromDays(SHARE_TTL_DAYS),
  ).toISOString();
  for (let attempt = 0; attempt < MAX_ID_RETRIES; attempt += 1) {
    const shareLinkId = nanoid(10);
    const insertShareResult = await supabaseServer.from("tempo_shares").insert({
      itineraries_id: itineraryId,
      share_link_id: shareLinkId,
      expires_at: expiresAt,
    });
    console.log("[api/publish] insert tempo_shares", {
      attempt,
      share_link_id: shareLinkId,
      error: insertShareResult.error,
    });
    if (!insertShareResult.error) {
      return NextResponse.json({ id: shareLinkId, expires_at: expiresAt });
    }
    if (insertShareResult.error.code === "23505") {
      continue;
    }
    return NextResponse.json(
      { error: insertShareResult.error.message },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { error: "failed to generate unique share link id" },
    { status: 500 },
  );
}
