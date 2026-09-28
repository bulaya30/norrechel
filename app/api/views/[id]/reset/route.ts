import { viewService } from "@/lib/container/view.container";
import { success, failure, type Params } from "@/lib/api/response";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(
    request: Request,
  { params }: RouteContext,
) {
    try {
        const { id } = await params;
        await viewService.deleteView(id);
        return success({ success: true });
    } catch (error) {
        return failure(error, 400);
    }
}