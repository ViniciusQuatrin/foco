"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { historicoPage, nav } from "@/content/copy";
import { historyLine } from "@/lib/format";
import { loadHistory } from "@/lib/storage";
import { HistoryItem } from "@/lib/types";
import { AppHeader } from "./AppHeader";

export function HistoryList() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(loadHistory());
    setReady(true);
  }, []);

  return (
    <div className="center-shell">
      <div className="page page-centered page-historico">
      <AppHeader />
      <main className="page-body">
        <h1 className="page-title">{historicoPage.title}</h1>
        <p className="hint">{historicoPage.note}</p>

        {!ready ? null : items.length === 0 ? (
          <div className="empty">
            <p className="empty-title">{historicoPage.emptyTitle}</p>
            <p className="hint">{historicoPage.emptyBody}</p>
          </div>
        ) : (
          <ul className="history-list">
            {items.map((it) => (
              <li key={it.id} className="history-item">
                {historyLine(it.name, it.mode, it.durationSeconds, it.completedAt)}
              </li>
            ))}
          </ul>
        )}

        <Link href="/" className="btn btn-ghost touch back-link">
          {nav.backTimer}
        </Link>
      </main>
      </div>
    </div>
  );
}
