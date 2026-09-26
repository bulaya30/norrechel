import { Timestamp } from "firebase-admin/firestore";

export type Status = "new" | "replied"

export interface Contact {
    id?: string;
    name : string,
    email : string,
    subject : string,
    message : string,
    source_page : string,
    content_id : string,
    content_type : string,
    status : Status,
    date?: Timestamp,
    submittedAt?: Timestamp
    repliedAt?: Timestamp
    createdAt?: Timestamp
    updatedAt?: Timestamp
}

export interface ContactInput {
    name : string,
    email : string,
    subject : string,
    message : string,
    source_page : string,
    content_id : string,
    content_type : string,
    status : Status,
    submittedAt: string | object,
    date?: Timestamp,
}

export interface ContactStats {
  total: number;
  new: number;
  replied: number;
}