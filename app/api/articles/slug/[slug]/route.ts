import { articleService } from "@/lib/container/article.container";
import { success, failure } from "@/lib/api/response";

type Params = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: Params) {
  try {
    const { slug } = await params;

    const article = await articleService.getArticleBySlug(slug);

    if (!article) {
      return failure(new Error("Article not found"), 404);
    }

    return success(article);
  } catch (error) {
    return failure(error, 400);
  }
}