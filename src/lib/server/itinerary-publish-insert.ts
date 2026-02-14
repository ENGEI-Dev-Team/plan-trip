import type { ItineraryPublishArgs } from "@/types/publish";
import { toTimelineDayItemInserts } from "@/lib/server/timeline-day-items-insert";

export const toItineraryUpdate = (args: ItineraryPublishArgs) => ({
  title: args.title || null,
  pref_code: args.pref_code || null,
  start_date: args.start_date || null,
  end_date: args.end_date || null,
  people: args.people_count || 1,
});

export const toDayItemsInsert = (args: ItineraryPublishArgs) =>
  toTimelineDayItemInserts(args.itinerary_id, args.items);
