import { contactService } from "@/lib/container";

import { success, failure } from "@/lib/api/response";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;

    const contact = await contactService.getContactById(id);

    return success(contact);
  } catch (error) {
    return failure(error, 400);
  }
}

export async function DELETE(
  request: Request,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;

    await contactService.deleteContact(id);

    return success({ id });
  } catch (error) {
    return failure(error, 400);
  }
}