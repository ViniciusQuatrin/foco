"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { entrarPage, nav } from "@/content/copy";
import { AppHeader } from "./AppHeader";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    // No backend in v1 — always show generic error from COPY
    setError(entrarPage.error);
  }

  return (
    <div className="page">
      <AppHeader showEnter={false} />
      <main className="page-body">
        <div className="entrar-brand" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo-256.png"
            width={128}
            height={128}
            className="entrar-logo"
            alt=""
            decoding="async"
          />
        </div>
        <h1 className="page-title">{entrarPage.title}</h1>
        <p className="hint">{entrarPage.promise}</p>

        <form className="login-form" onSubmit={onSubmit} noValidate>
          <label className="field">
            <span className="field-label">{entrarPage.email}</span>
            <input
              type="email"
              className="input"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="field">
            <span className="field-label">{entrarPage.password}</span>
            <input
              type="password"
              className="input"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error ? (
            <p className="field-error" role="alert">
              {error}
            </p>
          ) : null}
          <button type="submit" className="btn btn-primary touch">
            {entrarPage.submit}
          </button>
        </form>

        <button
          type="button"
          className="btn btn-ghost touch"
          onClick={() => router.push("/")}
        >
          {nav.continueGuest}
        </button>

        <Link href="/" className="btn btn-ghost touch back-link">
          {nav.backTimer}
        </Link>
      </main>
    </div>
  );
}
