import ContactManager from "@/features/contacts/components/ContactManager";
import { getCachedContacts } from "@/features/contacts/queries/contact.queries";

type SupportedLocale = "en" | "fr";

interface ContactsPageProps {
  params: Promise<{
    locale: SupportedLocale;
  }>;
}

export default async function ContactsPage({
  params,
}: ContactsPageProps) {
  const { locale } = await params;

  const contacts = await getCachedContacts();

  return (
    <ContactManager
      locale={locale}
      contacts={contacts}
    />
  );
}
