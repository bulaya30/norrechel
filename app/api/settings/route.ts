import { settingService } from "@/lib/container/setting.container";
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api/handle-api-error";

export async function GET(request: Request) {
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

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // temporary until auth middleware
    const uid = body.uid;

    // If your updateSetting requires an id,
    // get it from the request body.
    const { id } = body;

    const settings = await settingService.updateSetting(
      uid,
      id,
      body,
    );

    return NextResponse.json(settings);
  } catch (error) {
    return handleApiError(error);
  }
}