import type { ItineraryDraft } from "@/types/itinerory";

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

type ItineraryRow = {
  id: string;
  title: string | null;
  pref_code: string | null;
  start_date: string | null;
  end_date: string | null;
  updated_at: string | null;
};

type DayItemRow = {
  day_index: number | null;
  start_time: string | null;
  title: string | null;
  memo: string | null;
  sort_order: number | null;
};

const normalizeTime = (value: string) => {
  const hhmm = /^\d{2}:\d{2}$/;
  const hhmmss = /^\d{2}:\d{2}:\d{2}$/;
  if (hhmmss.test(value)) return value;
  if (hhmm.test(value)) return `${value}:00`;
  return null;
};

const parseEventMemo = (notes: string, location?: string) => {
  if (!location) return notes;
  return `${notes}\n場所: ${location}`;
};

const splitEventMemo = (memo: string | null) => {
  if (!memo) {
    return { notes: "", location: undefined as string | undefined };
  }
  const marker = "\n場所: ";
  const index = memo.indexOf(marker);
  if (index < 0) {
    return { notes: memo, location: undefined as string | undefined };
  }
  return {
    notes: memo.slice(0, index),
    location: memo.slice(index + marker.length) || undefined,
  };
};

export const draftToItineraryInsert = (
  draft: ItineraryDraft,
): ItineraryInsert => ({
  title: draft.title,
  pref_code: draft.destination,
  start_date: draft.startDate || null,
  end_date: draft.endDate || null,
  people: 1,
});

export const draftToDayItemInserts = (
  itineraryId: string,
  draft: ItineraryDraft,
): DayItemInsert[] => {
  return draft.dailySchedules.flatMap((schedule, dayIdx) =>
    schedule.events.map((event, sortIdx) => ({
      itinerary_id: itineraryId,
      day_index: dayIdx + 1,
      start_time: normalizeTime(event.time),
      end_time: null,
      category: "other",
      title: event.activity,
      memo: parseEventMemo(event.notes, event.location),
      cost_jpy: null,
      sort_order: sortIdx + 1,
    })),
  );
};

export const rowsToDraft = (
  itinerary: ItineraryRow,
  dayItems: DayItemRow[],
): ItineraryDraft => {
  const startDateValue = itinerary.start_date
    ? new Date(itinerary.start_date)
    : null;
  const buildScheduleDate = (dayIndex: number) => {
    if (!startDateValue || Number.isNaN(startDateValue.getTime())) return "";
    const next = new Date(startDateValue);
    next.setDate(next.getDate() + (dayIndex - 1));
    return next.toISOString().slice(0, 10);
  };

  const grouped = new Map<number, DayItemRow[]>();
  for (const item of dayItems) {
    const day = item.day_index ?? 1;
    const current = grouped.get(day) ?? [];
    current.push(item);
    grouped.set(day, current);
  }

  const dailySchedules = [...grouped.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([dayIndex, items]) => ({
      date: buildScheduleDate(dayIndex),
      summary: `Day ${dayIndex}`,
      events: items
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((item, idx) => {
          const memo = splitEventMemo(item.memo);
          return {
            eventId: `${dayIndex}-${idx + 1}`,
            time: item.start_time?.slice(0, 5) ?? "",
            activity: item.title ?? "",
            notes: memo.notes,
            location: memo.location,
          };
        }),
    }));

  const safeStartDate = itinerary.start_date ?? "";
  return {
    id: itinerary.id,
    title: itinerary.title ?? "",
    destination: itinerary.pref_code ?? "",
    startDate: safeStartDate,
    endDate: itinerary.end_date ?? safeStartDate,
    dailySchedules,
    lastSavedAt: itinerary.updated_at
      ? Date.parse(itinerary.updated_at)
      : Date.now(),
  };
};
