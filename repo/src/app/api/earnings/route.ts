import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth-helpers";
import { db } from "@/lib/db";

/**
 * GET /api/earnings
 * Get earnings summary for the authenticated user.
 *
 * Query params:
 *   ?groupBy=day|platform|category  (default: "day")
 *   ?from=2025-01-01               (optional start date)
 *   ?to=2025-12-31                 (optional end date)
 *   ?platformId=uber-eats          (optional filter)
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await authenticateRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const groupBy = url.searchParams.get("groupBy") ?? "day";
    const fromDate = url.searchParams.get("from");
    const toDate = url.searchParams.get("to");
    const platformId = url.searchParams.get("platformId");

    const where: Record<string, unknown> = {
      userId,
    };

    if (platformId) {
      where.platformId = platformId;
    }

    if (fromDate || toDate) {
      const dateFilter: Record<string, Date> = {};
      if (fromDate) dateFilter.gte = new Date(fromDate);
      if (toDate) dateFilter.lte = new Date(toDate);
      where.date = dateFilter;
    }

    const records = await db.earningRecord.findMany({
      where,
      orderBy: { date: "desc" },
    });

    // Overall summary
    const totalAmount = records.reduce((sum, r) => sum + r.amount, 0);
    const totalOrders = records.reduce((sum, r) => sum + r.orderCount, 0);

    let grouped: Record<string, { amount: number; orderCount: number; records: typeof records }>;

    switch (groupBy) {
      case "platform":
        grouped = groupRecords(records, "platformId");
        break;
      case "category":
        grouped = groupRecords(records, "category");
        break;
      case "day":
      default:
        grouped = groupRecordsByDay(records);
        break;
    }

    const summary = Object.entries(grouped).map(([key, value]) => ({
      key,
      amount: value.amount,
      orderCount: value.orderCount,
      records: value.records,
    }));

    return NextResponse.json({
      summary: {
        totalAmount,
        totalOrders,
        currency: records[0]?.currency ?? "USD",
        recordCount: records.length,
      },
      grouped: summary,
    });
  } catch (error) {
    console.error("[API] Error fetching earnings:", error);
    return NextResponse.json(
      { error: "Failed to fetch earnings" },
      { status: 500 }
    );
  }
}

/**
 * Group records by a specific field.
 */
function groupRecords(
  records: Awaited<ReturnType<typeof db.earningRecord.findMany>>,
  field: "platformId" | "category"
): Record<string, { amount: number; orderCount: number; records: typeof records }> {
  const grouped: Record<string, { amount: number; orderCount: number; records: typeof records }> = {};

  for (const record of records) {
    const key = record[field] as string;
    if (!grouped[key]) {
      grouped[key] = { amount: 0, orderCount: 0, records: [] };
    }
    grouped[key].amount += record.amount;
    grouped[key].orderCount += record.orderCount;
    grouped[key].records.push(record);
  }

  return grouped;
}

/**
 * Group records by day (YYYY-MM-DD format).
 */
function groupRecordsByDay(
  records: Awaited<ReturnType<typeof db.earningRecord.findMany>>
): Record<string, { amount: number; orderCount: number; records: typeof records }> {
  const grouped: Record<string, { amount: number; orderCount: number; records: typeof records }> = {};

  for (const record of records) {
    const key = record.date.toISOString().split("T")[0]; // YYYY-MM-DD
    if (!grouped[key]) {
      grouped[key] = { amount: 0, orderCount: 0, records: [] };
    }
    grouped[key].amount += record.amount;
    grouped[key].orderCount += record.orderCount;
    grouped[key].records.push(record);
  }

  return grouped;
}
