/** 旅のしおりのドラフト全体を保持するオブジェクト */
export interface ItineraryDraft {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  dailySchedules: DailySchedule[];
  /** 最終自動保存日時 (Unixミリ秒) */
  lastSavedAt: number;
}

/** 特定の日付のスケジュール */
export interface DailySchedule {
  date: string;
  summary: string;
  events: TravelEvent[];
}

/** 特定の行動・アクティビティ */
export interface TravelEvent {
  eventId: string;
  time: string;
  activity: string;
  notes: string;
  location?: string;
}
