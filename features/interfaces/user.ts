import { Timestamp } from "firebase-admin/firestore";

export type Role = "admin" | "user";

export type AuthResponse = {
  user: User;
  token: string;
};

export interface LoginDto {
  idToken: string;
}

export interface UserInput {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id?: string;

  firstName: string;
  lastName: string;

  contact: string;
  company: string;

  role: Role;

  address: string;
  email: string;

  facebook: string;
  linkedin: string;
  twitter: string;
  github: string;
  instagram: string;

  about: string;

  photo: string;
  photo_public_id?: string | null;

  title: string;

  date?: Timestamp;

  active?: boolean;

  deletedAt?: Timestamp;
  updatedAt?: Timestamp;
  createdAt?: Timestamp;
}

export interface UserData {
  firstName: string;
  lastName: string;
  role: Role;
  email: string;
  active: boolean;
}

export interface UserUpdateInput {
  firstName?: string;
  lastName?: string;
  contact?: string;
  company?: string;
  address?: string;
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  instagram?: string;
  about?: string;
  title?: string;
  photo?: File | null;
}