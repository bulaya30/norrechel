
import type { Timestamp } from "firebase-admin/firestore";

export type Status = "new" | "replied";

export type ContactContentType =
  | "general"
  | "article"
  | "project";

export type ContactPurpose = "general" | "business";

export type ProjectType =
  | "website"
  | "custom-software"
  | "dashboard"
  | "management-system"
  | "other";

export type ProjectBudget =
  | "under-500k"
  | "500k-1m"
  | "1m-3m"
  | "3m-5m"
  | "5m-10m"
  | "above-10m"
  | "not-sure";

export interface Contact {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;

  purpose?: ContactPurpose;

  businessName?: string;
  projectType?: ProjectType;
  budget?: ProjectBudget;

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

export interface BusinessContactInput extends GeneralContactInput {
  purpose: "business";
  businessName?: string;
  projectType: ProjectType;
  budget?: ProjectBudget;
}

export interface ContactInput extends GeneralContactInput {
  source_page: string;
  content_id: string;
  content_type: "article" | "project";
}

export type CreateContactInput =
  | GeneralContactInput
  | ContactInput
  | BusinessContactInput;

export interface ContactStats {
  total: number;
  new: number;
  replied: number;
}
