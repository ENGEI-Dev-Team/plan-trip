import { useCallback, useState } from "react";
import type { ItineraryDraft } from "@/types/itinerory";
import type { CreateShareResponse } from "@/types/share";

type PublishState = {
  shareId: string | null;
  isPublishing: boolean;
  error: string | null;
};

export const useSharePublish = () => {
  const [state, setState] = useState<PublishState>({
    shareId: null,
    isPublishing: false,
    error: null,
  });

  const publish = useCallback(async (draft: ItineraryDraft) => {
    setState((prev) => ({ ...prev, isPublishing: true, error: null }));

    try {
      const response = await fetch("/api/shares", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload: draft }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error ?? "共有リンクの作成に失敗しました");
      }

      const data = (await response.json()) as CreateShareResponse;
      setState({ shareId: data.id, isPublishing: false, error: null });
      return data.id as string;
    } catch (error) {
      setState({
        shareId: null,
        isPublishing: false,
        error:
          error instanceof Error
            ? error.message
            : "共有リンクの作成に失敗しました",
      });
      return null;
    }
  }, []);

  return { ...state, publish };
};
