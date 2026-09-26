import {
  FirebaseError,
} from "firebase/app";

import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "@/lib/firebase/client";

export type FirebaseLoginInput = {
  email: string;
  password: string;
};

export type FirebaseLoginResult =
  | {
      success: true;
      idToken: string;
    }
  | {
      success: false;
      message: string;
    };

export async function loginWithFirebase(
  input: FirebaseLoginInput
): Promise<FirebaseLoginResult> {
  try {
    const credential = await signInWithEmailAndPassword(
      auth,
      input.email,
      input.password
    );

    const idToken = await credential.user.getIdToken();

    return {
      success: true,
      idToken,
    };
  } catch (error) {
    console.error("Firebase login failed:", error);

    return {
      success: false,
      message: getFirebaseLoginErrorMessage(error),
    };
  }
}

export async function logoutFromFirebase(): Promise<void> {
  await signOut(auth);
}

function getFirebaseLoginErrorMessage(
  error: unknown
): string {
  if (!(error instanceof FirebaseError)) {
    return "Unable to sign in. Please try again.";
  }

  switch (error.code) {
    case "auth/invalid-email":
      return "Enter a valid email address.";

    case "auth/user-disabled":
      return "This account has been disabled.";

    case "auth/too-many-requests":
      return "Too many login attempts. Please try again later.";

    case "auth/network-request-failed":
      return "Unable to connect. Check your internet connection.";

    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Wrong email address or password.";

    default:
      return "Unable to sign in. Please try again.";
  }
}