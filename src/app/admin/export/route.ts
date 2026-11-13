import type { NextRequest } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { AdminDataError, fetchResponses, parseFilters, toCsv } from "@/lib/survey-stats";

export async function GET(request: NextRequest) {
  if (!(await isAdmin())) {
    return new Response("Sign in at /admin/login first.", { status: 401 });
  }

  const filters = parseFilters(Object.fromEntries(request.nextUrl.searchParams));
  try {
    const rows = await fetchResponses(filters);
    const date = new Date().toISOString().slice(0, 10);
    return new Response(toCsv(rows), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="survey-responses-${date}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    const message = e instanceof AdminDataError ? e.message : "Could not export responses.";
    return new Response(message, { status: 500 });
  }
}
