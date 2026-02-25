import React from "react";
import { Category } from "@/types/itinerary";

interface CategoryBadgeProps {
  category: Category;
  className?: string;
}

const categoryColors: Record<Category, string> = {
  移動: "bg-blue-100 text-blue-800",
  食事: "bg-orange-100 text-orange-800",
  観光: "bg-green-100 text-green-800",
  宿: "bg-purple-100 text-purple-800",
  体験: "bg-pink-100 text-pink-800",
  買い物: "bg-yellow-100 text-yellow-800",
  その他: "bg-gray-100 text-gray-800",
};

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  className = "",
}) => {
  return (
    <span
      className={`px-2 py-0.5 text-xs rounded ${categoryColors[category]} ${className}`}
    >
      {category}
    </span>
  );
};
