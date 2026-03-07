import { NextResponse } from "next/server";
import { createShareFromDraft } from "@/lib/server/share-service";
import type { CreateShareRequest } from "@/types/share";

export async function POST(request: Request) {
  const body = (await request
    .json()
    .catch(() => null)) as CreateShareRequest | null;
  if (!body?.payload) {
    return NextResponse.json({ error: "payload is required" }, { status: 400 });
  }
  try {
    const result = await createShareFromDraft(body.payload);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "failed to create share",
      },
      { status: 500 },
    );
  }
}