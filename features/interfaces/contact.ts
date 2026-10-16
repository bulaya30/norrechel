import type { Timestamp } from "firebase-admin/firestore";

export type Status = "new" | "replied";
export type ContactContentType = "general" | "article" | "project";

export interface Contact {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  source_page: string;
  content_id: string;
  content_type: ContactContentType;
  status: Status;
  date?: Timestamp;
  submittedAt?: Timestamp;
  repliedAt?: Timestamp;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface GeneralContactInput {
  name: string;
  email: string;
  message: string;
  subject?: string;
}

export interface ContactInput extends GeneralContactInput {
  source_page: string;
  content_id: string;
  content_type: "article" | "project";
}

export type CreateContactInput = GeneralContactInput | ContactInput;

export interface ContactStats {
  total: number;
  new: number;
  replied: number;
}