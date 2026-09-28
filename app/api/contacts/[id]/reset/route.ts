import { contactService } from "@/lib/container/contact.container";

import { success, failure } from "@/lib/api/response";

export async function DELETE(request: Request) {
  try {
    const body = await request.json();

    const { id } = body;

    if (!id) {
      return failure(new Error("Contact ID is required"), 400);
    }

    await contactService.deleteContact(id);

    return success({ id });
  } catch (error) {
    return failure(error, 400);
  }
}