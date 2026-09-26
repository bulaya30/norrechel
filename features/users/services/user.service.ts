import "server-only";

import { type SignOptions } from "jsonwebtoken";
import { Timestamp } from "firebase-admin/firestore";

import {
  uploadImage,
  type UploadedImage,
} from "@/lib/cloudinary/uploadImage";

import UserRepository from "@/features/users/repositories/user.repository";
import SettingsRepository from "@/features/settings/repositories/setting.repository";
import ArticleRepository from "@/features/articles/repositories/article.repository";
import ProjectRepository from "@/features/projects/repositories/project.repository";
import NotificationRepository from "@/features/notifications/repositories/notification.repository";

import type {
  User,
  LoginDto,
  UserInput,
  UserUpdateInput,
  AuthResponse,
  UserData,
  Role,
} from "@/features/interfaces/user";

if (!process.env.JWT_SECRET) {
  throw new Error("Missing JWT_SECRET");
}

const JWT_SECRET = process.env.JWT_SECRET;

const options: SignOptions = {
  expiresIn: "1d",
};

export default class UserService {
  constructor(
    private userRepository: UserRepository,
    private settingsRepository: SettingsRepository,
    private articleRepository: ArticleRepository,
    private projectRepository: ProjectRepository,
    private notificationRepository: NotificationRepository
  ) {}

  private async checkUser(uid: string): Promise<User> {
    if (!uid) {
      throw new Error("User id is required");
    }

    const user = await this.userRepository.findById(uid);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  private async uploadProfilePhoto(
    uid: string,
    file: File
  ): Promise<UploadedImage> {
    if (!uid) {
      throw new Error("User id is required");
    }

    if (!file) {
      throw new Error("File is required");
    }

    return uploadImage(file, {
      folder: `users/${uid}`,
      publicId: `profile-${uid}`,
    });
  }

  async getUsers(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async getUserById(id: string): Promise<User> {
    return await this.checkUser(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  async createUser(data: UserInput): Promise<User> {
    if (!data || Object.keys(data).length === 0) {
      throw new Error("User data is required");
    }

    const { name, email, password } = data;

    if (!name || !email || !password) {
      throw new Error(
        "Name, email, and password are required"
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser =
      await this.userRepository.findByEmail(
        normalizedEmail
      );

    if (existingUser) {
      throw new Error("User already exists");
    }

    const adminExists =
      await this.userRepository.findByRole("admin");

    const role: Role = adminExists ? "user" : "admin";

    const credential =
      await this.userRepository.register(
        normalizedEmail,
        password
      );

    const [firstName = "", ...rest] =
      name.trim().split(" ");

    const userData: User = {
      firstName,
      lastName: rest.join(" "),
      email: normalizedEmail,

      active: true,
      role,

      contact: "",
      company: "",
      address: "",

      facebook: "",
      linkedin: "",
      twitter: "",
      github: "",
      instagram: "",

      about: "",
      photo: "",
      photo_public_id: null,

      title: "",

      date: Timestamp.now(),
    };

    const user =
      await this.userRepository.create(
        userData,
        credential.uid
      );

    await this.settingsRepository.createDefaultSettings(
      credential.uid
    );

    return user;
  }

  async updateUser(
    id: string,
    data: UserUpdateInput
  ): Promise<boolean> {
    if (!id) {
      throw new Error("User id is required");
    }

    if (!data || Object.keys(data).length === 0) {
      throw new Error("No update data provided");
    }

    const user = await this.checkUser(id);

    const payload: Partial<User> = {};

    if (data.firstName !== undefined) {
      payload.firstName = data.firstName;
    }

    if (data.lastName !== undefined) {
      payload.lastName = data.lastName;
    }

    if (data.contact !== undefined) {
      payload.contact = data.contact;
    }

    if (data.company !== undefined) {
      payload.company = data.company;
    }

    if (data.address !== undefined) {
      payload.address = data.address;
    }

    if (data.facebook !== undefined) {
      payload.facebook = data.facebook;
    }

    if (data.linkedin !== undefined) {
      payload.linkedin = data.linkedin;
    }

    if (data.twitter !== undefined) {
      payload.twitter = data.twitter;
    }

    if (data.github !== undefined) {
      payload.github = data.github;
    }

    if (data.instagram !== undefined) {
      payload.instagram = data.instagram;
    }

    if (data.about !== undefined) {
      payload.about = data.about;
    }

    if (data.title !== undefined) {
      payload.title = data.title;
    }

    /*
     * User selected a new profile photo.
     */
    if (data.photo) {
      const uploaded =
        await this.uploadProfilePhoto(
          id,
          data.photo
        );

      payload.photo = uploaded.url;
      payload.photo_public_id =
        uploaded.publicId;
    }

    if (Object.keys(payload).length === 0) {
      throw new Error(
        "No valid update data provided"
      );
    }

    return await this.userRepository.update(
      id,
      {
        ...payload,
        updatedAt: Timestamp.now(),
      }
    );
  }

  async deleteUser(id: string): Promise<boolean> {
    await this.checkUser(id);

    await this.settingsRepository.reset(id);
    await this.articleRepository.reset(id);
    await this.notificationRepository.reset(id);
    await this.projectRepository.reset(id);

    return await this.userRepository.delete(id);
  }

  async login(data: LoginDto): Promise<User> {
    const { idToken } = data;

    if (!idToken) {
      throw new Error(
        "Authentication token is required"
      );
    }

    const decoded =
      await this.userRepository.verifyToken(
        idToken
      );

    const user =
      await this.userRepository.findById(
        decoded.uid
      );

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
}
