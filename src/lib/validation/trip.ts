// src/lib/validation/trip.ts
import { z } from "zod";
import { DateTime } from "luxon";
import type { TripCreateInput } from "@/types/trip";

export const tripCreateSchema = z
  .object({
    title: z
      .string()
      .min(1, "タイトルを入力してください")
      .max(50, "タイトルは50文字以内で入力してください"),
    prefecture: z.string().min(1, "都道府県を選択してください"),
    startDate: z.string().min(1, "開始日を選択してください"),
    endDate: z.string().min(1, "終了日を選択してください"),
  })
  .refine(
    (data) => {
      const start = DateTime.fromISO(data.startDate);
      const end = DateTime.fromISO(data.endDate);
      if (!start.isValid || !end.isValid) return true; // ここは個別の必須チェックに任せる
      return end >= start;
    },
    {
      message: "終了日は開始日以降の日付を選択してください",
      path: ["endDate"],
    },
  );

export type TripCreateSchema = z.infer<typeof tripCreateSchema>;
export type TripCreateInputStrict = TripCreateInput & TripCreateSchema;
