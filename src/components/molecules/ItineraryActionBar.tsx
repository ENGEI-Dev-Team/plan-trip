
'use client';

import React from 'react';
import { PrintNavigationButton } from '@/components/atoms/PrintNavigationButton';

interface ItineraryActionBarProps {
  itineraryId: string;
  onEdit?: () => void;
  onShare?: () => void;
  onDelete?: () => void;
  showEdit?: boolean;
  showShare?: boolean;
  showDelete?: boolean;
  showPrint?: boolean;
}

export const ItineraryActionBar: React.FC<ItineraryActionBarProps> = ({
  itineraryId,
  onEdit,
  onShare,
  onDelete,
  showEdit = true,
  showShare = true,
  showDelete = false,
  showPrint = true,
}) => {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      {showEdit && onEdit && (
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
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
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          編集
        </button>
      )}

      {showShare && onShare && (
        <button
          onClick={onShare}
          className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
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
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          共有
        </button>
      )}

      {showPrint && (
        <PrintNavigationButton itineraryId={itineraryId} />
      )}

      {showDelete && onDelete && (
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          削除
        </button>
      )}
    </div>
  );
};