import { articleService } from "@/lib/container/article.container";
import { success, failure } from "@/lib/api/response";

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // temporary until auth middleware
    const uid = searchParams.get("uid");

    if (!uid) {
      throw new Error("User id is required");
    }

    await articleService.resetAllArticles(uid);

    return success({ reset: true });
  } catch (error) {
    return failure(error, 400);
  }
}