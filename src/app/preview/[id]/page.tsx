"use client";

import { useEffect, useMemo, useState } from "react";
import { ItineraryData } from "@/types/itinerary";
import { ItineraryDraft } from "@/types/itinerory";
import type { GetShareResponse } from "@/types/share";
import { useRouter } from "next/navigation";
import { ItineraryPreviewLayout } from "@/components/templates/ItineraryPreviewLayout";

type PreviewPageProps = {
  params: {
    id: string;
  };
};

const toItineraryData = (draft: ItineraryDraft): ItineraryData => {
  return {
    basicInfo: {
      title: draft.title,
      prefecture: draft.destination,
      startDate: draft.startDate,
      endDate: draft.endDate,
    },
    schedules: draft.dailySchedules.map((schedule) => ({
      date: schedule.date,
      items: schedule.events.map((event) => ({
        id: event.eventId,
        time: event.time,
        category: "その他",
        title: event.activity,
        memo: event.location
          ? `${event.notes} / ${event.location}`
          : event.notes,
      })),
    })),
  };
};

export default function PreviewPage({ params }: PreviewPageProps) {
  const [draft, setDraft] = useState<ItineraryDraft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchShare = async () => {
      try {
        const response = await fetch(`/api/shares/${params.id}`);
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data?.error ?? "共有リンクの取得に失敗しました");
        }
        const data = (await response.json()) as GetShareResponse;
        setDraft(data.payload as ItineraryDraft);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "共有リンクの取得に失敗しました",
        );
      }
    };
    fetchShare();
  }, [params.id]);

  const itineraryData = useMemo(
    () => (draft ? toItineraryData(draft) : null),
    [draft],
  );

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  if (!itineraryData) {
    return <div className="p-6">読み込み中...</div>;
  }

  return (
    <ItineraryPreviewLayout
      itineraryData={itineraryData}
      memberCount={2}
      onBack={() => router.back()}
    />
  );
}
