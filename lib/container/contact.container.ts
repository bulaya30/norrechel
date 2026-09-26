import "server-only";

import ContactRepository from "@/features/contacts/repositories/contact.repository";
import ContactService from "@/features/contacts/services/contact.service";


const contactRepository = new ContactRepository();
export const contactService = new ContactService(contactRepository);