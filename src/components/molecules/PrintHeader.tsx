import React from "react";

interface PrintHeaderProps {
  title: string;
  subtitle?: string;
}

export const PrintHeader: React.FC<PrintHeaderProps> = ({
  title,
  subtitle,
}) => {
  return (
    <div className="mb-4 pb-2 border-b-2 border-gray-300">
      <h2 className="text-lg font-bold">{title}</h2>
      {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
    </div>
  );
};
