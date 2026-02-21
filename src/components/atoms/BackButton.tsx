"use client";

import React from "react";

interface BackButtonProps {
  onClick?: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
  return (
    <button onClick={onClick} aria-label="編集に戻る">
      ← 編集に戻る
    </button>
  );
};
