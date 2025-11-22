import { ItineraryDraft } from '@/types/itinerary';

const COOKIE_NAME = 'itinerary_draft';

// ダミーデータ（初回ロード時などに利用）
export const EMPTY_DRAFT: ItineraryDraft = {
  id: 'temp-' + Date.now(),
  title: '',
  destination: '',
  startDate: '',
  endDate: '',
  dailySchedules: [],
  lastSavedAt: 0,
};

/**
 * ドラフトデータをCookieに保存する関数
 */
export function saveDraft(data: ItineraryDraft): void {
  try {
    const jsonString = JSON.stringify(data);
    
    // Cookieの最大容量は4KB程度。保存期間は14日と仮定
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(jsonString)}; max-age=${60 * 60 * 24 * 14}; path=/`;
    console.log(`[AutoSave] Draft saved to cookie: ${data.lastSavedAt}`);
  } catch (e) {
    console.error('[AutoSave] Failed to save draft to cookie:', e);
  }
}

/**
 * Cookieからドラフトデータを読み込む関数
 */
export function loadDraft(): ItineraryDraft | null {
  try {
    const name = `${COOKIE_NAME}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            const jsonString = c.substring(name.length, c.length);
            const data = JSON.parse(jsonString);
            console.log(`[AutoSave] Draft loaded from cookie: ${data.lastSavedAt}`);
            return data as ItineraryDraft;
        }
    }
    return null;
  } catch (e) {
    console.warn('[AutoSave] No valid draft found in cookie.');
    return null;
  }
}