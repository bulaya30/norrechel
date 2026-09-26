import { categoryService } from "@/lib/container/category.container";
import { success, failure, type Params } from "@/lib/api/response";

export async function PATCH(request: Request, { params }: Params) {
    try {
        const { id } = await params;
        
        await categoryService.restoreCategory(id);
        return success({ id, active: true });
    } catch (error) {
        return failure(error, 400);
    }
}