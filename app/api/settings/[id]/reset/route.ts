import { settingService } from "@/lib/container/setting.container";

import { success, failure } from "@/lib/api/response";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  req: Request,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;

    await settingService.resetSetting(id);

    return success({ success: true });
  } catch (error) {
    return failure(error);
  }
}