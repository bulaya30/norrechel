import { contactService } from "@/lib/container";
import { success, failure, type Params } from "@/lib/api/response";

export async function GET({ params }: Params) {
    try {
        const { id } = await params;
        const contact = await contactService.getContactById(id);
        return success(contact);
    } catch (error) {
        return failure(error, 400);
    }
}

export async function DELETE({ params }: Params) {
    try {
        const { id } = await params;
        await contactService.deleteContact(id);
        return success({ id });
    } catch (error) {
        return failure(error, 400);
    }
}

