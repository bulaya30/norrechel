import { engagementService } from "@/lib/container/engagement.container";
import { success, failure, type Params } from "@/lib/api/response";


export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);

    // temporary until auth middleware
    const uid = searchParams.get("uid");

    if (!uid) {
      throw new Error("User id is required");
    }

    const article = await engagementService.getEngagementById(id);

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

    if (!uid) {
      throw new Error("User id is required");
    }

    await engagementService.updateEngagement(id, body);

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

    await engagementService.deleteEngagement(id);

    return success({ id });
  } catch (error) {
    return failure(error, 400);
  }
}