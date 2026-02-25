// src/hooks/useCreateTrip.ts
import { useMutation } from "@tanstack/react-query";
import type { TripCreateInput } from "@/types/trip";
import { createTrip } from "@/lib/api/trip";

export function useCreateTrip() {
  return useMutation({
    mutationFn: (input: TripCreateInput) => createTrip(input),
  });
}
