"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  checkPassword,
  createSessionToken,
  isPasswordConfigured,
  sessionCookieOptions,
} from "@/lib/admin-auth";

export type LoginState = { error?: string } | undefined;

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    // Slow down guessing.
    await new Promise((r) => setTimeout(r, 800));
    return {
      error: isPasswordConfigured()
        ? "That password isn't right. Try again."
        : "The admin password isn't set up on the server yet.",
    };
  }
  (await cookies()).set(ADMIN_COOKIE, createSessionToken(), sessionCookieOptions);
  redirect("/admin");
}

export async function logout(): Promise<void> {
  (await cookies()).delete({ name: ADMIN_COOKIE, path: "/admin" });
  redirect("/admin/login");
}
