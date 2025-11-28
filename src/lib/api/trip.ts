// src/lib/api/trip.ts
import type { TripCreateInput } from "@/types/trip";

// TODO: Supabase 実装に差し替え
export async function createTrip(input: TripCreateInput): Promise<{ id: string }> {
  // ここに Supabase の insert ロジックを追加する想定
  // 例:
  // const { data, error } = await supabase
  //   .from("trips")
  //   .insert({ ...input })
  //   .select("id")
  //   .single();
  //
  // if (error) throw error;
  // return { id: data.id };

  // ひとまずモック
  await new Promise((resolve) => setTimeout(resolve, 500));
  const mockId = crypto.randomUUID();
  return { id: mockId };
}