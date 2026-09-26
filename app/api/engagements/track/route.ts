import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  engagementService,
} from "@/lib/container/engagement.container";

export async function POST(
  request: NextRequest,
) {
  try {
    const data = await request.json();

    const engagement =
      await engagementService.createEngagement(
        {
          visitor_id: data.visitor_id,
          content_id: data.content_id,
          content_type: data.content_type,
          event_type: data.event_type,
          event_value: data.event_value,
          metadata: data.metadata ?? null,
        },
      );

    return NextResponse.json(
      {
        success: true,
        engagementId: engagement.id,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "Engagement tracking failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to track engagement.",
      },
      {
        status: 500,
      },
    );
  }
}