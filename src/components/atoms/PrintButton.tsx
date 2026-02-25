"use client";

import React from "react";

interface PrintButtonProps {
  onClick: () => void;
  className?: string;
}

export const PrintButton: React.FC<PrintButtonProps> = ({
  onClick,
  className = "",
}) => {
  return (
    <button onClick={onClick} className={className} aria-label="印刷や保存">
      🖨️ 印刷 / 保存
    </button>
  );
};
