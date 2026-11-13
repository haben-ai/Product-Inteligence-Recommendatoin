import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Admin access: one shared password (ADMIN_PASSWORD). A successful login sets an
 * httpOnly cookie holding an expiry signed with ADMIN_SESSION_SECRET (HMAC-SHA256).
 * Call requireAdmin()/isAdmin() in EVERY admin page, action and route handler.
 */

export const ADMIN_COOKIE = "tbc_admin";
const MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

function sessionSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("ADMIN_SESSION_SECRET is missing or too short");
  return s;
}

function sign(value: string): string {
  return createHmac("sha256", sessionSecret()).update(value).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function createSessionToken(): string {
  const expires = String(Date.now() + MAX_AGE_SECONDS * 1000);
  return `${expires}.${sign(expires)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature || !/^\d+$/.test(expires)) return false;
  if (!safeEqual(signature, sign(expires))) return false;
  return Number(expires) > Date.now();
}

/** Constant-time password check. Returns false if no password is configured. */
export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || expected.length < 8) return false;
  // Hash both sides so the comparison is constant-time regardless of length.
  const h = (v: string) => createHmac("sha256", "admin-password").update(v).digest();
  return timingSafeEqual(h(input), h(expected));
}

export function isPasswordConfigured(): boolean {
  const p = process.env.ADMIN_PASSWORD;
  return !!p && p.length >= 8;
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/admin",
  maxAge: MAX_AGE_SECONDS,
};

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}
