"use client";

import { ItineraryActionBar } from "../../components/molecules/ItineraryActionBar";
import { useRouter } from "next/navigation";

export default function MyPage() {
  const router = useRouter();
  const itineraryId = "your-itinerary-id";

  const handleEdit = () => {
    router.push(`/edit/${itineraryId}`);
  };

  const handleShare = () => {
    // 共有処理
  };

  return (
    <div className="card">
      <h2>京都・大阪 2泊3日の旅</h2>
      <ItineraryActionBar
        itineraryId={itineraryId}
        onEdit={handleEdit}
        onShare={handleShare}
        showEdit={true}
        showShare={true}
        showPrint={true}
        showDelete={false}
      />
    </div>
  );
}
