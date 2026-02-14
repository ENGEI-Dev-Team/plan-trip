import type { ItineraryDraft } from "@/types/itinerory";

export type CreateShareRequest = {
  payload: ItineraryDraft;
};

export type CreateShareResponse = {
  id: string;
  expires_at: string;
};

export type GetShareResponse = {
  payload: ItineraryDraft;
  expires_at: string;
};
