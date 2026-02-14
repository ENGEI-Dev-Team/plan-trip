// src/lib/api/trip.ts
import type { TripCreateInput } from "@/types/trip";

export async function createTrip(
  input: TripCreateInput,
): Promise<{ id: string }> {
  const response = await fetch("/api/itineraries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.error ?? "failed to create trip");
  }

  const data = await response.json();
  return { id: data.id as string };
}
