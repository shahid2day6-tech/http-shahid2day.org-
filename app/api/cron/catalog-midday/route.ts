import { NextRequest, NextResponse } from "next/server";
import { refreshCatalog } from "../../../lib/catalogRefresh";
import { assertCronAuth } from "../../../lib/cronAuth";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  if (!assertCronAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await refreshCatalog();
  return NextResponse.json(result);
}
