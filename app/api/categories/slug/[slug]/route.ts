import { categoryService } from "@/lib/container";
import { success, failure } from "@/lib/api/response";

type Params = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: Params) {
    try {
        const { slug } = await params;
        const category = await categoryService.getCategoryBySlug(slug);
        return success(category);
    } catch (error) {
        return failure(error, 400);
    }
}
