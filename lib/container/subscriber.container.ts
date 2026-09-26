import "server-only";

import SubscriberRepository from "@/features/subscribers/repositories/subscriber.repository";
import SubscriberService from "@/features/subscribers/services/subscriber.service";

const subscriberRepository = new SubscriberRepository();
export const subscriberService = new SubscriberService(subscriberRepository);