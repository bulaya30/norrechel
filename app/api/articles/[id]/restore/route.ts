import { articleService } from "@/lib/container/article.container";
import { success, failure } from "@/lib/api/response";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();

    // temporary until auth middleware
    const uid = body.uid;

    await articleService.restoreArticle(uid, id);

    return success({ id, active: true });
    
  } catch (error) {
    return failure(error, 400);
  }
}