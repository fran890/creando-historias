import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const JWT_SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "super-secret-jwt-key-change-this-in-production-min-32-chars"
);

export interface AuthSession {
  userId: string;
  email: string;
  username: string;
  name: string;
  role: "ADMIN" | "AUTHOR";
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(session: AuthSession): Promise<string> {
  return new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET_KEY);
}

export async function verifySessionToken(token: string): Promise<AuthSession | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET_KEY);
    return verified.payload as unknown as AuthSession;
  } catch (error) {
    return null;
  }
}

export async function getCurrentUser(): Promise<AuthSession | null> {
  const cookieStore = cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;

  const session = await verifySessionToken(token);
  if (!session) return null;

  // Check if user is blocked or deleted in DB
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { isBlocked: true, role: true },
  });

  if (!user || user.isBlocked) return null;

  return {
    ...session,
    role: user.role as "ADMIN" | "AUTHOR",
  };
}

export async function setSessionCookie(session: AuthSession) {
  const token = await createSessionToken(session);
  const cookieStore = cookies();
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearSessionCookie() {
  const cookieStore = cookies();
  cookieStore.set("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
