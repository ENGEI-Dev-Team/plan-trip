import { useState, useEffect, useRef, useCallback } from 'react';
import { ItineraryDraft } from '@/types/itinerary';
import { loadDraft, saveDraft, EMPTY_DRAFT } from '@/utils/cookie';

type AutoSaveStatus = 'idle' | 'saving' | 'saved';

// 自動保存の間隔 (500ミリ秒)
const DEBOUNCE_DELAY = 500;

/**
 * Cookieを利用した自動保存ロジックを提供するカスタムフック
 */
export const useAutoSave = () => {
  // 1. ステートの初期化: Cookieから既存のドラフトを読み込む
  const [draft, setDraft] = useState<ItineraryDraft>(loadDraft() || EMPTY_DRAFT);
  
  // 2. 自動保存の状態管理
  const [status, setStatus] = useState<AutoSaveStatus>('idle');
  
  // 3. デバウンス用タイマーの参照
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 実際の保存処理（再利用可能なようにuseCallbackで定義）
  const performSave = useCallback((data: ItineraryDraft) => {
    // 最終保存日時を更新して保存を実行
    saveDraft({ ...data, lastSavedAt: Date.now() });
    setStatus('saved');
  }, []);


  // --- 外部公開用関数 ---

  /** * ドラフトの更新。この関数がフォームのonChangeイベントなどで呼ばれる
   */
  const updateDraft = useCallback((newDraft: ItineraryDraft) => {
    setDraft(newDraft);
    setStatus('saving'); // 変更があったらステータスを「保存中」に設定
  }, []);

  /**
   * onBlurなどで呼ばれる、デバウンスを無視した即時保存関数
   */
  const forceSave = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current); // 既存のデバウンスタイマーをクリア
      timerRef.current = null;
    }
    performSave(draft); // 即時保存を実行
  }, [draft, performSave]);


  // --- 自動デバウンス処理 ---

  useEffect(() => {
    // statusが'saving'でなければ自動保存は不要
    if (status !== 'saving') return;

    // 1. 既存のタイマーがあればクリア
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // 2. 新しいデバウンスタイマーを設定
    timerRef.current = setTimeout(() => {
      // 500ms後に入力が止まっていたら保存実行
      performSave(draft);
    }, DEBOUNCE_DELAY);

    // 3. クリーンアップ関数: コンポーネントがアンマウントされる時や
    //    draftが再度変更された時にタイマーをクリアする
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [draft, status, performSave]);


  return { draft, updateDraft, status, forceSave };
};