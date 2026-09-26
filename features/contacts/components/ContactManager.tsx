"use client";

import { useMemo, useState } from "react";

import ContactFilters from "@/features/contacts/components/ContactFilters";
import ContactList from "@/features/contacts/components/ContactList";
import ContactStats from "@/features/contacts/components/ContactStats";

import type {
  Contact,
  Status,
} from "@/features/interfaces/contact";

type SupportedLocale = "en" | "fr";

interface ContactManagerProps {
  locale: SupportedLocale;
  contacts: Contact[];
}

type ContactFilter = "all" | Status;

export default function ContactManager({
  locale,
  contacts,
}: ContactManagerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<ContactFilter>("all");

  /*
   * -------------------------------------------
   * Statistics
   * -------------------------------------------
   */

  const stats = useMemo(() => {
    return {
      total: contacts.length,

      new: contacts.filter(
        (contact) => contact.status === "new",
      ).length,

      replied: contacts.filter(
        (contact) => contact.status === "replied",
      ).length,
    };
  }, [contacts]);

  /*
   * -------------------------------------------
   * Filtering
   * -------------------------------------------
   */

  const filteredContacts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return contacts.filter((contact) => {
      if (
        statusFilter !== "all" &&
        contact.status !== statusFilter
      ) {
        return false;
      }

      if (!query) {
        return true;
      }

      return (
        contact.name.toLowerCase().includes(query) ||
        contact.email.toLowerCase().includes(query) ||
        contact.subject.toLowerCase().includes(query)
      );
    });
  }, [
    contacts,
    searchQuery,
    statusFilter,
  ]);

  return (
    <div className="space-y-6">
      <ContactStats
        total={stats.total}
        newCount={stats.new}
        replied={stats.replied}
      />

      <ContactFilters
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        onSearchChange={setSearchQuery}
        onStatusChange={setStatusFilter}
      />

      <ContactList
        locale={locale}
        contacts={filteredContacts}
      />
    </div>
  );
}
