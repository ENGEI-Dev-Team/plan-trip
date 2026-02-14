import React from "react";

interface AutoSaveStatusIndicatorProps {
  status: "idle" | "saving" | "saved";
  lastSavedAt: number;
}

export const AutoSaveStatusIndicator: React.FC<
  AutoSaveStatusIndicatorProps
> = ({ status, lastSavedAt }) => {
  const time = lastSavedAt ? new Date(lastSavedAt).toLocaleTimeString() : "";

  switch (status) {
    case "saving":
      return <div className="text-yellow-600">🔄 保存中...</div>;
    case "saved":
      return <div className="text-green-600">✅ {time} に保存済み</div>;
    case "idle":
    default:
      return <div className="text-gray-500">未保存の変更はありません</div>;
  }
};
