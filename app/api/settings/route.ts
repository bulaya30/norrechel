import { settingService } from "@/lib/container/setting.container";
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api/handle-api-error";
import type { Params } from "@/lib/api/response";

export async function GET(request: Request, { params }: Params) {
    try {
        const body = await request.json();

        // temporary until auth middleware
        const uid = body.uid;
        const settings = await settingService.getUserSettings(uid);
        return NextResponse.json(settings);
    } catch (error) {
        return handleApiError(error);
    }
}

export async function POST(request: Request, { params }: Params) {
    try {
        const { id } = await params;
        const body = await request.json();
        const uid = body.uid;
        const settings = await settingService.updateSetting(uid, id, body);
        return NextResponse.json(settings);
    } catch (error) {
        return handleApiError(error);
    }
}