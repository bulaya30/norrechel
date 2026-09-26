import { NextResponse } from "next/server";

import { viewService } from "@/lib/container/view.container";

import { handleApiError } from "@/lib/api/handle-api-error";

export async function GET() {
    try {
        
        const views = await viewService.getViews();

        return NextResponse.json({
          success: true,
          data: views,
        });

        
    } catch (error) {
        handleApiError(error)
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const view = await viewService.createView(body);
        return NextResponse.json({ success: true, data: view });
    } catch (error) {
        handleApiError(error)
    }
}