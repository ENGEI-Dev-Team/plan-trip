import { nanoid } from "nanoid";

const SHARE_ID_LENGTH = 10;
const MAX_ID_RETRIES = 3;

export const generateShareId = () => nanoid(SHARE_ID_LENGTH);

export const shouldRetryDuplicateKey = (error: {
  code?: string;
  message?: string;
}) => {
  return error.code === "23505" || error.message?.includes("duplicate");
};

export const maxShareIdRetries = MAX_ID_RETRIES;
