"use client";

import Link from "next/link";
import { nav, product } from "@/content/copy";
import { ThemeToggle } from "./ThemeToggle";

export function AppHeader({ showEnter = true }: { showEnter?: boolean }) {
  return (
    <header className="app-header">
      <Link href="/" className="brand">
        {product.name}
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
