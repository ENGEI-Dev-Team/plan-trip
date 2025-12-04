
export interface TripCreateInput {
  title: string;
  prefecture: string; // まずは単一選択前提。複数対応するなら string[] でもOK
  startDate: string;  // ISO形式 "2025-03-01"
  endDate: string;
}
