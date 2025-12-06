
'use client';

import { PrintNavigationButton } from '@/components/atoms/PrintNavigationButton';
import { useParams } from 'next/navigation';

export default function EditPage() {
  const params = useParams();
  const itineraryId = params.id as string;

  return (
    <div>
      <header className="flex justify-between items-center">
        <h1>しおりを編集</h1>
        <div className="flex gap-3">
          <button>保存</button>
          <PrintNavigationButton 
            itineraryId={itineraryId}
            variant="secondary" // セカンダリスタイル
          />
        </div>
      </header>
      {/* 編集フォーム */}
    </div>
  );
}