import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const secretValue = process.env.JWT_SECRET;

if (!secretValue) {
  throw new Error("JWT_SECRET environment variable is not configured.");
}

const encodedSecret = new TextEncoder().encode(secretValue);

export const AUTH_COOKIE_NAME = "norrechel_access_token";

export interface AuthTokenPayload extends JWTPayload {
  userId: string;
  email: string;
  role: "admin" | "author" | "user";
}

export async function createAccessToken(
  payload: Pick<AuthTokenPayload, "userId" | "email" | "role">
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({
      alg: "HS256",
      typ: "JWT",
    })
    .setIssuedAt()
    .setIssuer("norrechel")
    .setAudience("norrechel-web")
    .setExpirationTime("15m")
    .sign(encodedSecret);
}

export async function verifyAccessToken(
  token: string
): Promise<AuthTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedSecret, {
      algorithms: ["HS256"],
      issuer: "norrechel",
      audience: "norrechel-web",
    });

    if (
      typeof payload.userId !== "string" ||
      typeof payload.email !== "string" ||
      !isValidRole(payload.role)
    ) {
      return null;
    }

    return payload as AuthTokenPayload;
  } catch {
    return null;
  }
}

function isValidRole(
  role: unknown
): role is AuthTokenPayload["role"] {
  return (
    role === "admin" ||
    role === "author" ||
    role === "user"
  );
}