import { categoryService } from "@/lib/container";
import { success, failure, type Params } from "@/lib/api/response";

export async function DELETE(request: Request, { params }: Params) {
    try {
        const { id } = await params;
        await categoryService.deleteCategory(id);
        return success({ id });
    } catch (error) {
        return failure(error, 400);
    }
}
