import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * GET /api/orders
 * List the authenticated user's accepted orders with pagination.
 *
 * Query params: ?page=1&limit=20&status=accepted|completed|cancelled&platformId=...
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1"));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") ?? "20")));
    const status = url.searchParams.get("status") ?? undefined;
    const platformId = url.searchParams.get("platformId") ?? undefined;

    const where: Record<string, unknown> = {
      userId: session.user.id,
    };

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
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
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

    const order = await db.acceptedOrder.create({
      data: {
        userId: session.user.id,
        platformId,
        category,
        value: parseFloat(String(value)),
        currency: currency ?? "USD",
        pickup,
        dropoff,
        distance: parseFloat(String(distance)),
        distanceUnit: distanceUnit ?? "mi",
        status: "accepted",
      },
    });

    // Audit log
    await db.auditLog.create({
      data: {
        userId: session.user.id,
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
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
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
        userId: session.user.id,
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
    if (status === "completed") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await db.earningRecord.upsert({
        where: {
          id: `earning-${orderId}`,
        },
        create: {
          id: `earning-${orderId}`,
          userId: session.user.id,
          platformId: existing.platformId,
          category: existing.category,
          amount: existing.value,
          currency: existing.currency,
          date: today,
          orderCount: 1,
        },
        update: {
          amount: { increment: existing.value },
          orderCount: { increment: 1 },
        },
      });
    }

    // Audit log
    await db.auditLog.create({
      data: {
        userId: session.user.id,
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
