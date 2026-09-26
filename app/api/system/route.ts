import { systemService } from "@/lib/container/system.container";
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api/handle-api-error";

export async function GET() {
    try {
        const system = await systemService.getSystem();
        return NextResponse.json(system);
    } catch (error) {
        return handleApiError(error);
    }
}

export async function POST(_request: Request) {
    try {
        const system = await systemService.lockSystem();
        return NextResponse.json(system);
    } catch (error) {
        return handleApiError(error);
    }
}
