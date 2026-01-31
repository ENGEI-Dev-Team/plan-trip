import React, { useCallback } from 'react';
import { useAutoSave } from '@/hooks/useAutoSave';
import { AutoSaveStatusIndicator } from '@/components/atoms/AutoSaveStatusIndicator';
import { ItineraryDraft } from '@/types/itinerary';

export const ItineraryDraftEditor: React.FC = () => {
  const { draft, updateDraft, status, forceSave } = useAutoSave();

  // フォームの入力変更をハンドリングする共通関数
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // draftのタイトルを更新する例
    const newDraft: ItineraryDraft = {
      ...draft,
      [name]: value,
    };

    updateDraft(newDraft); // カスタムフック経由で状態を更新
  }, [draft, updateDraft]);

  return (
    <form className="p-4 space-y-6">
      <h2>旅のしおり編集ドラフト</h2>
      
      {/* 1. タイトル入力フィールド */}
      <div className="flex flex-col">
        <label htmlFor="title" className="font-bold">旅行タイトル</label>
        <input
          id="title"
          name="title"
          value={draft.title}
          onChange={handleChange}
          onBlur={forceSave} // ★ フォームからカーソルが離れたら即時保存を強制実行
          className="border p-2"
        />
      </div>

      {/* 2. 目的地入力フィールド */}
      <div className="flex flex-col">
        <label htmlFor="destination" className="font-bold">目的地</label>
        <input
          id="destination"
          name="destination"
          value={draft.destination}
          onChange={handleChange}
          onBlur={forceSave} // ★ 即時保存
          className="border p-2"
        />
      </div>

      {/* 3. スケジュール入力フィールド (ここでは省略) */}
      {/* ... DailySchedule や TravelEvent の入力フォームを配置 ... */}

      <hr />

      {/* 4. 自動保存ステータス表示 */}
      <div className="flex justify-end">
        <AutoSaveStatusIndicator status={status} lastSavedAt={draft.lastSavedAt} />
      </div>

      {/* 5. 最終保存ボタン (手動保存) */}
      <button 
        type="button" 
        onClick={forceSave} 
        disabled={status === 'saved'}
        className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-400"
      >
        手動で保存
      </button>

    </form>
  );
};