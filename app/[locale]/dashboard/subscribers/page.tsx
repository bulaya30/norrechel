import SubscriberManager from "@/features/subscribers/components/SubscriberManager";
import { getCachedSubscribers } from "@/features/subscribers/queries/subscriber.queries";

type SupportedLocale = "en" | "fr";

interface SubscribersPageProps {
  params: Promise<{
    locale: SupportedLocale;
  }>;
}

export default async function SubscribersPage({
  params,
}: SubscribersPageProps) {
  const { locale } = await params;

  const subscribers = await getCachedSubscribers();

  return (
    <SubscriberManager
      subscribers={subscribers}
    />
  );
}
