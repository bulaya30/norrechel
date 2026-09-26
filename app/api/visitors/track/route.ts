
import { NextRequest, NextResponse } from "next/server";

import { visitorService } from "@/lib/container/visitor.container";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const visitor = await visitorService.trackVisitor(
      request,
      {
        visitorId: data.visitorId,
        sessionId: data.sessionId,
      },
    );

    return NextResponse.json(
      {
        success: true,
        visitorId: visitor.visitorId,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "Visitor tracking failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to track visitor.",
      },
      {
        status: 500,
      },
    );
  }
}