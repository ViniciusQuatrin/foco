import type { Metadata } from "next";
import { HistoryList } from "@/components/HistoryList";
import { docs } from "@/content/copy";

export const metadata: Metadata = {
  title: docs.historico,
};

export default function HistoricoPage() {
  return <HistoryList />;
}
