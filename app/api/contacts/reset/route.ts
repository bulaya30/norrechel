import { contactService } from "@/lib/container/contact.container";
import { success, failure, type Params } from "@/lib/api/response";

export async function DELETE(request: Request, { params }: Params) {
    try {
        const { id } = await params;
        await contactService.deleteContact(id);
        return success({ id });
    } catch (error) {
        return failure(error, 400);
    }
}