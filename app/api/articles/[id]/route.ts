import { articleService } from "@/lib/container/article.container";
import { success, failure } from "@/lib/api/response";


type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);

    // temporary until auth middleware
    const uid = searchParams.get("uid");

    if (!uid) {
      throw new Error("User id is required");
    }

    const article = await articleService.getArticleById(uid, id);

    return success(article);
  } catch (error) {
    return failure(error, 400);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();

    // temporary until auth middleware
    const uid = body.uid;

    await articleService.updateArticle(uid, id, body);

    return success({ id });
  } catch (error) {
    return failure(error, 400);
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);

    // temporary until auth middleware
    const uid = searchParams.get("uid");

    if (!uid) {
      throw new Error("User id is required");
    }

    await articleService.deleteArticle(uid, id);

    return success({ id });
  } catch (error) {
    return failure(error, 400);
  }
}