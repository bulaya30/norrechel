import { getContentAnalysis } from "@/analytics/statistics";
import type { Article } from "@/features/interfaces/article";

export type EnrichedArticle = Omit<Article, "views" | "engagements"> & {
  analytics: ReturnType<typeof getContentAnalysis>;
};

export function enrichArticle(article: Article): EnrichedArticle {
  const { views, engagements, ...articleData } = article;

  return {
    ...articleData,
    analytics: getContentAnalysis(views ?? [], engagements ?? []),
  };
}