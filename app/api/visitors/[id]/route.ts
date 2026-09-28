import { visitorService } from "@/lib/container/visitor.container";
import { success, failure, type Params } from "@/lib/api/response";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(
    req: Request,
  { params }: RouteContext,
) {
    try {
        const { id } = await params;
        await visitorService.deleteVisitor(id);
        return success({ success: true });
    } catch (error) {
        return failure(error, 400);
    }
}