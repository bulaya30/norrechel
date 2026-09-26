import { contactService } from "@/lib/container/contact.container";
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api/handle-api-error";

export async function GET() {
    try {
        const contacts = await contactService.getContacts();
        return NextResponse.json({ success: true, data: contacts });
    } catch (error) {
        handleApiError(error)
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const contact = await contactService.createContact(body);
        return NextResponse.json({ success: true, data: contact });
    } catch (error) {
        handleApiError(error)
    }
}