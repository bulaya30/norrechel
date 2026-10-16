import "server-only";

import ContactRepository from "@/features/contacts/repositories/contact.repository";
import type { Contact, CreateContactInput, Status } from "@/features/interfaces/contact";

import { Timestamp } from "firebase-admin/firestore";

export default class ContactService {
  constructor(private contactRepository: ContactRepository) {}

  async getContacts(): Promise<Contact[]> {
    return await this.contactRepository.findAll();
  }

  async getContactById(id: string): Promise<Contact | null> {
    if (!id) {
      throw new Error("Contact id is required");
    }

    return await this.contactRepository.findById(id);
  }

  
  
  async createContact(input: CreateContactInput): Promise<Contact> {
    if (!input) {
      throw new Error("Contact data is required");
    }

    const name = input.name?.trim();
    const email = input.email?.trim().toLowerCase();
    const message = input.message?.trim();
    const subject = input.subject?.trim() || "No subject";

    if (!name || !email || !message) {
      throw new Error("Name, email, and message are required");
    }

    let source_page = "/contact";
    let content_id = "";
    let content_type: Contact["content_type"] = "general";

    if (
      "source_page" in input &&
      "content_id" in input &&
      "content_type" in input
    ) {
      const sourcePage = input.source_page?.trim();
      const contentId = input.content_id?.trim();
      const contentType = input.content_type;

      if (
        !sourcePage ||
        !contentId ||
        (contentType !== "article" && contentType !== "project")
      ) {
        throw new Error("Invalid content reference");
      }

      source_page = sourcePage;
      content_id = contentId;
      content_type = contentType;
    }

    const now = Timestamp.now();

    const payload: Omit<Contact, "id"> = {
      name,
      email,
      subject,
      message,
      source_page,
      content_id,
      content_type,
      status: "new",
      submittedAt: now,
      date: now,
    };

    return this.contactRepository.create(payload);
  }



  async updateContact(id: string, data: Partial<Contact>): Promise<boolean> {
    if (!id) {
      throw new Error("Contact id is required");
    }

    if (!data || Object.keys(data).length === 0) {
      throw new Error("No update data provided");
    }

    const contact = await this.contactRepository.findById(id);

    if (!contact) {
      throw new Error("Contact not found");
    }

    return await this.contactRepository.update(id, data);
  }

  async markContactAsReplied(uid: string, id: string): Promise<boolean> {
    if (!uid) {
      throw new Error("User id is required");
    }

    if (!id) {
      throw new Error("Contact id is required");
    }

    const contact = await this.contactRepository.findById(id);

    if (!contact) {
      throw new Error("Contact not found");
    }

    if (contact.status === "replied") {
      throw new Error("Contact is already replied");
    }

    return await this.contactRepository.update(id, {
      status: "replied",
      repliedAt: Timestamp.now(),
    });
  }

  async deleteContact(id: string): Promise<boolean> {
    if (!id) {
      throw new Error("Contact id is required");
    }

    const contact = await this.contactRepository.findById(id);

    if (!contact) {
      throw new Error("Contact not found");
    }

    return await this.contactRepository.delete(id);
  }

  async reset(): Promise<boolean> {
    return await this.contactRepository.reset();
  }
}