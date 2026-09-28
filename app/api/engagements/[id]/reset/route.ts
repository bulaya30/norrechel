import { engagementService } from "@/lib/container/engagement.container";
import { success, failure, type Params } from "@/lib/api/response";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}


export async function DELETE( request: Request,
  { params }: RouteContext,
) {
    try {
        const { id } = await params;
        await engagementService.deleteEngagement(id);
        return success({ id });
    } catch (error) {
        return failure(error, 400);
    }
}

