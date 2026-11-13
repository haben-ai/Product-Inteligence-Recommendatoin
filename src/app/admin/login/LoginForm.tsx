"use client";

import { useActionState } from "react";
import { login, type LoginState } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, undefined);

  return (
    <form action={action} className="flex flex-col gap-4" aria-busy={pending || undefined}>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Admin password
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          autoFocus
          className="text-field"
          aria-invalid={state?.error ? true : undefined}
          aria-describedby={state?.error ? "login-error" : undefined}
        />
      </label>
      {state?.error && (
        <p id="login-error" role="alert" className="text-sm font-medium text-danger">
          {state.error}
        </p>
      )}
      <button type="submit" className="btn-primary self-start" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
