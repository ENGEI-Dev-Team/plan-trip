import type { TimelineItem } from "@/types/timeline";

export type ItineraryPublishArgs = {
  itinerary_id: string;
  title: string;
  pref_code: string;
  start_date: string;
  end_date: string;
  people_count: number;
  items: TimelineItem[];
};
