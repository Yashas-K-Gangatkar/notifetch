import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth-helpers";
import { db } from "@/lib/db";

/**
 * GET /api/notifications/export
 * Export the user's notifications as a CSV file.
 *
 * Query params (all optional):
 *   - source: filter by source (e.g., "swiggy_partner")
 *   - category: filter by category (e.g., "NEW_ORDER")
 *   - startDate: ISO 8601 date string (inclusive)
 *   - endDate: ISO 8601 date string (inclusive)
 *   - limit: max rows (default 1000, max 10000)
 *
 * Returns: text/csv with Content-Disposition: attachment
 *
 * Uses DPDP Act 2023 §8 right to data portability. Data is the user's own
 * captured notifications — no other user's data is included.
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await authenticateRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const source = searchParams.get("source");
    const category = searchParams.get("category");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const limit = Math.min(parseInt(searchParams.get("limit") || "1000", 10), 10000);

    const where: Record<string, unknown> = { userId };
    if (source && source !== "all") where.source = source;
    if (category) where.category = category;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) (where.createdAt as { gte?: Date }).gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        (where.createdAt as { lte?: Date }).lte = end;
      }
    }

    const notifications = await db.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        title: true,
        body: true,
        source: true,
        platform: true,
        packageName: true,
        category: true,
        orderValue: true,
        pickupLocation: true,
        dropoffLocation: true,
        distance: true,
        isRead: true,
        createdAt: true,
        receivedAt: true,
      },
    });

    // Build CSV
    const headers = [
      "id",
      "createdAt",
      "receivedAt",
      "source",
      "platform",
      "packageName",
      "category",
      "title",
      "body",
      "orderValue",
      "pickupLocation",
      "dropoffLocation",
      "distance",
      "isRead",
    ];

    const escapeCsv = (val: unknown): string => {
      if (val === null || val === undefined) return "";
      const str = typeof val === "string" ? val : String(val);
      // Wrap in quotes if contains comma, quote, newline, or leading/trailing space
      if (/[",\n\r]/.test(str) || str !== str.trim()) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const rows = notifications.map((n) =>
      [
        n.id,
        n.createdAt.toISOString(),
        n.receivedAt?.toISOString() ?? "",
        n.source,
        n.platform ?? "",
        n.packageName ?? "",
        n.category ?? "",
        n.title,
        n.body,
        n.orderValue ?? "",
        n.pickupLocation ?? "",
        n.dropoffLocation ?? "",
        n.distance ?? "",
        n.isRead ? "true" : "false",
      ]
        .map(escapeCsv)
        .join(",")
    );

    const csv = [headers.join(","), ...rows].join("\r\n");

    const filename = `notifetch-notifications-${new Date().toISOString().slice(0, 10)}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[API] Error exporting notifications CSV:", error);
    return NextResponse.json(
      { error: "Failed to export notifications" },
      { status: 500 }
    );
  }
}
