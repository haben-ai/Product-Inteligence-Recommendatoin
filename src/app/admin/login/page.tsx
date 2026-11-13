import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Admin sign in — Tigrigna Beauty & Care" };

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-6 pt-12 sm:pt-20">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl">Survey admin</h1>
        <p className="text-sm text-muted">Sign in to see survey responses.</p>
      </div>
      <div className="rounded-xl border border-line bg-card p-6 shadow-[var(--shadow-soft)]">
        <LoginForm />
      </div>
    </div>
  );
}
