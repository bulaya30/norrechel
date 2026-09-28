import { categoryService } from "@/lib/container";

import { success, failure } from "@/lib/api/response";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(
  request: Request,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;

    await categoryService.deleteCategory(id);

    return success({ id });
  } catch (error) {
    return failure(error, 400);
  }
}