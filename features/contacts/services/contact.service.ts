
import "server-only";

import ContactRepository from "@/features/contacts/repositories/contact.repository";

import type {
  Contact,
  CreateContactInput,
  ProjectType,
  ProjectBudget,
} from "@/features/interfaces/contact";

import { Timestamp } from "firebase-admin/firestore";

const VALID_PROJECT_TYPES: ProjectType[] = [
  "website",
  "custom-software",
  "dashboard",
  "management-system",
  "other",
];

const VALID_PROJECT_BUDGETS: ProjectBudget[] = [
  "under-500k",
  "500k-1m",
  "1m-3m",
  "3m-5m",
  "5m-10m",
  "above-10m",
  "not-sure",
];

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

    const now = Timestamp.now();

    // Business enquiry
    if ("purpose" in input && input.purpose === "business") {
      if (!VALID_PROJECT_TYPES.includes(input.projectType)) {
        throw new Error("Invalid project type");
      }

      if (
        input.budget !== undefined &&
        !VALID_PROJECT_BUDGETS.includes(input.budget)
      ) {
        throw new Error("Invalid project budget");
      }

      const payload: Omit<Contact, "id"> = {
        name,
        email,
        subject,
        message,

        purpose: "business",
        businessName: input.businessName?.trim() || "",
        projectType: input.projectType,
        ...(input.budget && { budget: input.budget }),

        source_page: "/contact?purpose=business",
        content_id: "",
        content_type: "general",

        status: "new",
        submittedAt: now,
        date: now,
      };

      return await this.contactRepository.create(payload);
    }

    // Article or project enquiry
    if ("content_type" in input) {
      const sourcePage = input.source_page?.trim();
      const contentId = input.content_id?.trim();

      if (
        !sourcePage ||
        !contentId ||
        !sourcePage.startsWith("/") ||
        sourcePage.startsWith("//") ||
        sourcePage.includes("\\") ||
        (input.content_type !== "article" &&
          input.content_type !== "project")
      ) {
        throw new Error("Invalid content reference");
      }

      const payload: Omit<Contact, "id"> = {
        name,
        email,
        subject,
        message,

        purpose: "general",
        source_page: sourcePage,
        content_id: contentId,
        content_type: input.content_type,

        status: "new",
        submittedAt: now,
        date: now,
      };

      return await this.contactRepository.create(payload);
    }

    // General contact
    const payload: Omit<Contact, "id"> = {
      name,
      email,
      subject,
      message,

      purpose: "general",
      source_page: "/contact",
      content_id: "",
      content_type: "general",

      status: "new",
      submittedAt: now,
      date: now,
    };

    return await this.contactRepository.create(payload);
  }

  async updateContact(
    id: string,
    data: Partial<Contact>,
  ): Promise<boolean> {
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
