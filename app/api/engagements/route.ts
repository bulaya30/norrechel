import { engagementService } from "@/lib/container/engagement.container";
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api/handle-api-error";

export async function GET() {
    try {
        const engagements = await engagementService.getEngagements();
        return NextResponse.json({ success: true, data: engagements });
    } catch (error) {
        handleApiError(error)
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const engagement = await engagementService.createEngagement(body);
        return NextResponse.json({ success: true, data: engagement });
    } catch (error) {
        handleApiError(error)
    }
}