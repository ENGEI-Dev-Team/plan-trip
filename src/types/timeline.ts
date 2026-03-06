export type TimelineCategory =
  | "move"
  | "meal"
  | "sight"
  | "stay"
  | "activity"
  | "shopping"
  | "other";

export type SortMode = "time" | "manual";

export interface TimelineItem {
  id: string;
  dayIndex?: number;
  time: string;
  category: TimelineCategory;
  title: string;
  memo: string;
  amount: number;
  orderIndex: number;
  photoUrl?: string;
}
