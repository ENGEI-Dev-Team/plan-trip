import { supabaseServer } from "@/lib/supabase-server";

type ItineraryInsert = {
  title: string;
  pref_code: string;
  start_date: string | null;
  end_date: string | null;
  people: number;
};

type DayItemInsert = {
  itinerary_id: string;
  day_index: number;
  start_time: string | null;
  end_time: string | null;
  category: string | null;
  title: string;
  memo: string | null;
  cost_jpy: number | null;
  sort_order: number;
};

type ShareInsert = {
  itineraries_id: string;
  share_link_id: string;
  expires_at: string;
};

export type ItineraryRow = {
  id: string;
  title: string | null;
  pref_code: string | null;
  start_date: string | null;
  end_date: string | null;
  updated_at: string | null;
};

export type DayItemRow = {
  day_index: number | null;
  start_time: string | null;
  title: string | null;
  memo: string | null;
  sort_order: number | null;
};

export const insertItinerary = async (values: ItineraryInsert) => {
  return supabaseServer
    .from("itineraries")
    .insert(values)
    .select("id")
    .single();
};

export const insertDayItems = async (values: DayItemInsert[]) => {
  if (values.length === 0) return { error: null } as const;
  return supabaseServer.from("day_items").insert(values);
};

export const insertTempoShare = async (values: ShareInsert) => {
  return supabaseServer.from("tempo_shares").insert(values);
};

export const deleteItineraryById = async (id: string) => {
  return supabaseServer.from("itineraries").delete().eq("id", id);
};

export const findActiveTempoShareByLinkId = async (
  shareLinkId: string,
  nowIso: string,
) => {
  return supabaseServer
    .from("tempo_shares")
    .select("itineraries_id, expires_at")
    .eq("share_link_id", shareLinkId)
    .gt("expires_at", nowIso)
    .maybeSingle();
};

export const findItineraryById = async (id: string) => {
  return supabaseServer
    .from("itineraries")
    .select("id, title, pref_code, start_date, end_date, updated_at")
    .eq("id", id)
    .single<ItineraryRow>();
};

export const findDayItemsByItineraryId = async (itineraryId: string) => {
  return supabaseServer
    .from("day_items")
    .select("day_index, start_time, title, memo, sort_order")
    .eq("itinerary_id", itineraryId)
    .order("day_index", { ascending: true })
    .order("sort_order", { ascending: true })
    .returns<DayItemRow[]>();
};
