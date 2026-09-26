import { Timestamp } from "firebase-admin/firestore"

export type NotificationType =
  | "article"
  | "project"
  | "subscriber"
  | "system";

export interface Notification {
  id?: string
  uid: string
  type: NotificationType
  title: string
  message: string
  entityId?: string
  entityType: string
  read: boolean
  href?: string | null
  readAt?: Timestamp
  dedupeKey?: string | null
  createdAt?: Timestamp
  updatedAt?: Timestamp
}