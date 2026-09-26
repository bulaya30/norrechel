import "server-only";

import ContactRepository from "@/features/contacts/repositories/contact.repository";
import type { Contact, ContactInput, Status } from "@/features/interfaces/contact";

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

  async createContact(contact: ContactInput): Promise<Contact> {
    if (!contact || Object.keys(contact).length === 0) {
      throw new Error("Contact data is required");
    }

    const {
      name,
      email,
      subject,
      message,
      source_page,
      content_id,
      content_type,
    } = contact;

    if (!name || !email || !message || !source_page || !content_type) {
      throw new Error("Name, email, message, source page, and content type are required");
    }

    const status: Status = "new";

    const payload: Omit<Contact, "id"> = {
      name,
      email,
      subject: subject || "No subject",
      message,
      source_page,
      content_id: content_id ?? "",
      content_type,
      status,
      submittedAt: Timestamp.now(),
      date: Timestamp.now(),
    };

    return await this.contactRepository.create(payload);
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