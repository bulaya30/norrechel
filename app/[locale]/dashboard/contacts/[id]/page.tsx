import ContentNotFound from "@/components/ContentNotFound";

import ContactDetails from "@/features/contacts/components/ContactDetails";
import { getCachedContactById } from "@/features/contacts/queries/contact.queries";

type SupportedLocale = "en" | "fr";

interface ContactDetailsPageProps {
  params: Promise<{
    locale: SupportedLocale;
    id: string;
  }>;
}

export default async function ContactDetailsPage({
  params,
}: ContactDetailsPageProps) {
  const { locale, id } = await params;

  const contact = await getCachedContactById(id);

  if (!contact) {
    return (
        <ContentNotFound
            locale={locale}
            component="Contact"
        />
    );
  }

  return (
    <ContactDetails
      locale={locale}
      contact={contact}
    />
  );
}
