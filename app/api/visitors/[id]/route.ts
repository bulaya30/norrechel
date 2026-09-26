import { visitorService } from "@/lib/container/visitor.container";
import { success, failure, type Params } from "@/lib/api/response";

export async function DELETE(_request: Request, { params }: Params) {
    try {
        const { id } = await params;
        await visitorService.deleteVisitor(id);
        return success({ success: true });
    } catch (error) {
        return failure(error, 400);
    }
}