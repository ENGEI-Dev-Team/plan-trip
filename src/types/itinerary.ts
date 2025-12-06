export type Category = '移動' | '食事' | '観光' | '宿' | '体験' | '買い物' | 'その他';

export interface ItineraryItem {
  id: string;
  time: string;
  category: Category;
  title: string;
  memo?: string;
  amount?: number;
}

export interface ItineraryBasicInfo {
  title: string;
  prefecture: string;
  startDate: string;
  endDate: string;
}

export interface DailySchedule {
  date: string;
  items: ItineraryItem[];
}

export interface ItineraryData {
  basicInfo: ItineraryBasicInfo;
  schedules: DailySchedule[];
}

export interface PrintSettings {
  showAmount: boolean;
  showMemo: boolean;
  fontSize: 'small' | 'medium' | 'large';
}