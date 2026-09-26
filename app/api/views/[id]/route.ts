import { viewService } from "@/lib/container";
import { success, failure, type Params } from "@/lib/api/response";

export async function GET(_request: Request, { params }: Params) {
    try {
        const { id } = await params;
        const view = await viewService.getViewById(id);
        return success(view);       
    } catch (error) {
        failure(error, 400)
    }
}

export async function DELETE(_request: Request, { params }: Params) {
    try {
        const { id } = await params;
        await viewService.deleteView(id);
        return success({ success: true });
    } catch (error) {
        failure(error, 400)
    }
}