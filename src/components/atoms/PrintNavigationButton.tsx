"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface PrintNavigationButtonProps {
  itineraryId: string;
  className?: string;
  variant?: "primary" | "secondary";
}

export const PrintNavigationButton: React.FC<PrintNavigationButtonProps> = ({
  itineraryId,
  className = "",
  variant = "primary",
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/print/${itineraryId}`);
  };

  const baseStyles =
    "px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2";
  const variantStyles =
    variant === "primary"
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50";

  return (
    <button
      onClick={handleClick}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
        />
      </svg>
      印刷メニューへ
    </button>
  );
};
