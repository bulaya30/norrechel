import {
  NextRequest,
  NextResponse,
} from "next/server";

import { viewService } from "@/lib/container/view.container";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const view = await viewService.createView({
      visitor_id: data.visitor_id,
      content_id: data.content_id,
      content_type: data.content_type,
      slug: data.slug,
      referrer: data.referrer ?? null,
      session_id: data.session_id,
    });

    return NextResponse.json(
      {
        success: true,
        viewId: view.id,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "View tracking failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to track view.",
      },
      {
        status: 500,
      },
    );
  }
}