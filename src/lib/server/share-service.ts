import type { ItineraryDraft } from "@/types/itinerory";
import { draftToItineraryInsert, rowsToDraft } from "@/lib/server/share-mapper";
import { buildDayItemInsertRows } from "@/lib/server/day-items-insert";
import {
  deleteItineraryById,
  findActiveTempoShareByLinkId,
  findDayItemsByItineraryId,
  findItineraryById,
  insertDayItems,
  insertItinerary,
  insertTempoShare,
} from "@/lib/server/share-repository";
import {
  generateShareId,
  maxShareIdRetries,
  shouldRetryDuplicateKey,
} from "@/lib/server/share-id";

const msFromDays = (days: number) => days * 24 * 60 * 60 * 1000;
const SHARE_TTL_DAYS = 30;

export const createShareFromDraft = async (draft: ItineraryDraft) => {
  const itineraryValues = draftToItineraryInsert(draft);
  const itineraryResult = await insertItinerary(itineraryValues);
  if (itineraryResult.error || !itineraryResult.data?.id) {
    throw new Error(
      itineraryResult.error?.message ?? "failed to create itinerary",
    );
  }

  const itineraryId = itineraryResult.data.id;
  const dayItems = buildDayItemInsertRows(itineraryId, draft);
  const dayItemsResult = await insertDayItems(dayItems);
  if (dayItemsResult.error) {
    await deleteItineraryById(itineraryId);
    throw new Error(dayItemsResult.error.message);
  }

  const expiresAt = new Date(
    Date.now() + msFromDays(SHARE_TTL_DAYS),
  ).toISOString();
  for (let attempt = 0; attempt < maxShareIdRetries; attempt += 1) {
    const shareLinkId = generateShareId();
    const shareResult = await insertTempoShare({
      itineraries_id: itineraryId,
      share_link_id: shareLinkId,
      expires_at: expiresAt,
    });

    if (!shareResult.error) {
      return { id: shareLinkId, expires_at: expiresAt };
    }

    if (shouldRetryDuplicateKey(shareResult.error)) {
      continue;
    }

    await deleteItineraryById(itineraryId);
    throw new Error(shareResult.error.message);
  }

  await deleteItineraryById(itineraryId);
  throw new Error("failed to generate unique share id");
};

export const getShareDraftByLinkId = async (shareLinkId: string) => {
  const nowIso = new Date().toISOString();
  const shareResult = await findActiveTempoShareByLinkId(shareLinkId, nowIso);
  if (shareResult.error) {
    throw new Error(shareResult.error.message);
  }
  if (!shareResult.data?.itineraries_id) {
    return null;
  }

  const itineraryResult = await findItineraryById(
    shareResult.data.itineraries_id,
  );
  if (itineraryResult.error || !itineraryResult.data) {
    throw new Error(itineraryResult.error?.message ?? "itinerary not found");
  }

  const dayItemsResult = await findDayItemsByItineraryId(
    shareResult.data.itineraries_id,
  );
  if (dayItemsResult.error) {
    throw new Error(dayItemsResult.error.message);
  }

  const payload = rowsToDraft(itineraryResult.data, dayItemsResult.data ?? []);
  return {
    payload,
    expires_at: shareResult.data.expires_at,
  };
};
