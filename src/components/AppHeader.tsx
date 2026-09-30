"use client";

import Link from "next/link";
import { nav, product } from "@/content/copy";
import { ThemeToggle } from "./ThemeToggle";

export function AppHeader({ showEnter = true }: { showEnter?: boolean }) {
  return (
    <header className="app-header">
      <Link href="/" className="brand" aria-label={product.name}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/logo-40.png"
          srcSet="/brand/logo-40.png 1x, /brand/logo-80.png 2x"
          width={40}
          height={40}
          className="brand-mark"
          alt=""
          decoding="async"
        />
        <span className="brand-name">{product.name}</span>
      </Link>
      <div className="header-actions">
        <ThemeToggle />
        {showEnter ? (
          <Link href="/entrar" className="btn btn-ghost touch link-tertiary">
            {nav.entrar}
          </Link>
        ) : null}
      </div>
    </header>
  );
}
