import { viewService } from "@/lib/container/view.container";
import { success, failure, type Params } from "@/lib/api/response";

export async function DELETE(_request: Request, { params }: Params) {
    try {
        const { id } = await params;
        await viewService.deleteView(id);
        return success({ success: true });
    } catch (error) {
        return failure(error, 400);
    }
}