import { Timestamp } from "firebase-admin/firestore";

export interface View {
    id?: string;
    visitor_id : string,
    content_id : string,
    content_type : string,
    slug : string,
    referrer : string | null,
    session_id : string,
    viewed_at: Timestamp,
    date: Timestamp;
    active?: boolean;
    deletedAt?: Timestamp
    updatedAt?: Timestamp
    createdAt?: Timestamp
}

export interface ViewInput {
  visitor_id: string;
  content_id: string;
  content_type: string;
  slug: string;
  referrer?: string | null;
  session_id: string;
}