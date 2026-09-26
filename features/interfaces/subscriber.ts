import { Timestamp } from "firebase-admin/firestore"

export interface Subscriber {
    id?: string
    email: string
    date: Timestamp
    active: boolean
    deletedAt?: Timestamp
    updatedAt?: Timestamp
    unsubscribedAt?: Timestamp
    createdAt?: Timestamp
}

export interface SubscriberInput {
    email: string
}