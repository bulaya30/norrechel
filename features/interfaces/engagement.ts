import { Timestamp } from "firebase-admin/firestore"
export interface Engagement {
    id?: string
    visitor_id : string,
    content_id : string,
    content_type : string,
    event_type : string,
    event_value : number,
    metadata : object,
    date: Timestamp,
    milestone?: number,
    active?: boolean,
    deletedAt?: Timestamp,
    updatedAt?: Timestamp,
    createdAt?: Timestamp,
}

export interface EngagementInput {
  visitor_id: string;
  content_id: string;
  content_type: string;
  event_type: string;
  event_value?: number;
  metadata: object;
}
