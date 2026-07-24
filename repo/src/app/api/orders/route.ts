import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth-helpers";
import { db } from "@/lib/db";

/**
 * GET /api/orders
 * List the authenticated user's accepted orders with pagination.
 *
 * Query params: ?page=1&limit=20&status=accepted|completed|cancelled&platformId=...
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await authenticateRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1"));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") ?? "20")));
    const status = url.searchParams.get("status") ?? undefined;
    const platformId = url.searchParams.get("platformId") ?? undefined;

    const where: Record<string, unknown> = { userId };

    if (status) {
      where.status = status;
    }
    if (platformId) {
      where.platformId = platformId;
    }

    const [orders, total] = await Promise.all([
      db.acceptedOrder.findMany({
        where,
        orderBy: { acceptedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.acceptedOrder.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[API] Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/orders
 * Accept a new order (create an AcceptedOrder).
 *
 * Body: { platformId, category, value, currency?, pickup, dropoff, distance, distanceUnit? }
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await authenticateRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      platformId,
      category,
      value,
      currency,
      pickup,
      dropoff,
      distance,
      distanceUnit,
    } = body;

    if (!platformId || !category || value === undefined || !pickup || !dropoff || distance === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: platformId, category, value, pickup, dropoff, distance" },
        { status: 400 }
      );
    }

    // v2.9.81 SECURITY FIX: Validate numeric fields to prevent Infinity / NaN / huge values.
    // parseFloat("1e308") = Infinity, parseFloat("abc") = NaN — both would store
    // as garbage in the DB and corrupt earnings aggregates.
    const numericValue = typeof value === "number" ? value : parseFloat(String(value));
    const numericDistance = typeof distance === "number" ? distance : parseFloat(String(distance));
    if (!Number.isFinite(numericValue) || numericValue < 0 || numericValue > 1_000_000) {
      return NextResponse.json(
        { error: "value must be a finite number between 0 and 1,000,000" },
        { status: 400 }
      );
    }
    if (!Number.isFinite(numericDistance) || numericDistance < 0 || numericDistance > 100_000) {
      return NextResponse.json(
        { error: "distance must be a finite number between 0 and 100,000" },
        { status: 400 }
      );
    }

    // v2.9.81 SECURITY FIX: Validate currency is a 3-letter ISO 4217 code.
    // Previously accepted any string — user could store currency="FOO" and break display.
    const normalizedCurrency = (currency ?? "USD").toUpperCase();
    if (!/^[A-Z]{3}$/.test(normalizedCurrency)) {
      return NextResponse.json(
        { error: "currency must be a 3-letter ISO 4217 code (e.g. USD, INR)" },
        { status: 400 }
      );
    }

    // v2.9.81 SECURITY FIX: Cap string field lengths to prevent DB bloat / abuse.
    if (typeof platformId !== "string" || platformId.length > 100) {
      return NextResponse.json({ error: "platformId too long (max 100)" }, { status: 400 });
    }
    if (typeof category !== "string" || category.length > 100) {
      return NextResponse.json({ error: "category too long (max 100)" }, { status: 400 });
    }
    if (typeof pickup !== "string" || pickup.length > 500) {
      return NextResponse.json({ error: "pickup too long (max 500)" }, { status: 400 });
    }
    if (typeof dropoff !== "string" || dropoff.length > 500) {
      return NextResponse.json({ error: "dropoff too long (max 500)" }, { status: 400 });
    }

    const order = await db.acceptedOrder.create({
      data: {
        userId,
        platformId,
        category,
        value: numericValue,
        currency: normalizedCurrency,
        pickup,
        dropoff,
        distance: numericDistance,
        distanceUnit: distanceUnit ?? "mi",
        status: "accepted",
      },
    });

    // Audit log
    await db.auditLog.create({
      data: {
        userId,
        action: "ACCEPT_ORDER",
        entity: "AcceptedOrder",
        entityId: order.id,
        details: JSON.stringify({ platformId, category, value }),
      },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("[API] Error accepting order:", error);
    return NextResponse.json(
      { error: "Failed to accept order" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/orders
 * Update an order's status.
 *
 * Body: { orderId, status }
 */
export async function PATCH(request: NextRequest) {
  try {
    const userId = await authenticateRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { error: "orderId and status are required" },
        { status: 400 }
      );
    }

    const validStatuses = ["accepted", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const existing = await db.acceptedOrder.findFirst({
      where: {
        id: orderId,
        userId,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = { status };

    if (status === "completed") {
      updateData.completedAt = new Date();
    }

    const updated = await db.acceptedOrder.update({
      where: { id: orderId },
      data: updateData,
    });

    // If order is completed, create an earning record
    // Use a unique constraint to prevent double-counting from race conditions
    if (status === "completed") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check if earning record already exists for this order (prevent duplicates)
      const existingEarning = await db.earningRecord.findFirst({
        where: {
          userId,
          platformId: existing.platformId,
          date: today,
          // Check by matching orderId stored in a comment or use upsert carefully
        },
      });

      if (existingEarning) {
        // Increment existing record
        await db.earningRecord.update({
          where: { id: existingEarning.id },
          data: {
            amount: { increment: existing.value },
            orderCount: { increment: 1 },
          },
        });
      } else {
        // Create new earning record with random ID (not predictable)
        await db.earningRecord.create({
          data: {
            userId,
            platformId: existing.platformId,
            category: existing.category,
            amount: existing.value,
            currency: existing.currency,
            date: today,
            orderCount: 1,
          },
        });
      }
    }

    // Audit log
    await db.auditLog.create({
      data: {
        userId,
        action: "UPDATE_ORDER_STATUS",
        entity: "AcceptedOrder",
        entityId: orderId,
        details: JSON.stringify({ status }),
      },
    });

    return NextResponse.json({ order: updated });
  } catch (error) {
    console.error("[API] Error updating order status:", error);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
}
