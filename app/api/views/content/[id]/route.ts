import { viewService } from "@/lib/container/view.container";
import { success, failure, type Params } from "@/lib/api/response";


export async function GET(_request: Request, { params }: Params) {
    try {
        const { id } = await params;
        const view = await viewService.getViewsByContent(id);
        return success(view);
    } catch (error) {
        failure(error, 400);
    }
}