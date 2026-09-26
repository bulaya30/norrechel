import { getContentAnalysis } from "@/analytics/statistics";
import type { Project } from "@/features/interfaces/project";

export type EnrichedProject = Omit<Project, "views" | "engagements"> & {
  analytics: ReturnType<typeof getContentAnalysis>;
};

export function enrichProject(project: Project): EnrichedProject {
  const { views, engagements, ...projectData } = project;

  return {
    ...projectData,
    analytics: getContentAnalysis(views ?? [], engagements ?? []),
  };
}