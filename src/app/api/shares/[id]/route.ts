import { NextResponse } from "next/server";
import { getShareDraftByLinkId } from "@/lib/server/share-service";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  try {
    const result = await getShareDraftByLinkId(id);
    if (!result) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "failed to fetch share",
      },
      { status: 500 },
    );
  }
}
