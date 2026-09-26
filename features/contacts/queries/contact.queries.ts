import "server-only";

import { cache } from "react";
import { unstable_cache } from "next/cache";

import { contactService } from "@/lib/container/contact.container";

import type {
  Contact,
} from "@/features/interfaces/contact";

/*
 * -------------------------------------------
 * Get all contacts
 * -------------------------------------------
 */

export const getCachedContacts = unstable_cache(
  async (): Promise<Contact[]> => {
    return await contactService.getContacts();
  },
  ["contacts"],
  {
    tags: ["contacts"],
  },
);

/*
 * -------------------------------------------
 * Get contact by ID
 * -------------------------------------------
 */

export const getCachedContactById = cache(
  async (id: string): Promise<Contact | null> => {
    if (!id) {
      return null;
    }

    return await unstable_cache(
      async () => {
        return await contactService.getContactById(id);
      },
      [`contact:${id}`],
      {
        tags: [`contact:${id}`],
      },
    )();
  },
);

/*
 * -------------------------------------------
 * Get new contacts
 * -------------------------------------------
 */

export const getCachedNewContacts = unstable_cache(
  async (): Promise<Contact[]> => {
    const contacts = await contactService.getContacts();

    return contacts.filter(
      (contact) => contact.status === "new",
    );
  },
  ["contacts-new"],
  {
    tags: ["contacts"],
  },
);

/*
 * -------------------------------------------
 * Get replied contacts
 * -------------------------------------------
 */

export const getCachedRepliedContacts = unstable_cache(
  async (): Promise<Contact[]> => {
    const contacts = await contactService.getContacts();

    return contacts.filter(
      (contact) => contact.status === "replied",
    );
  },
  ["contacts-replied"],
  {
    tags: ["contacts"],
  },
);
