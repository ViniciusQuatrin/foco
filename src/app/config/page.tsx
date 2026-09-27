import type { Metadata } from "next";
import { ConfigForm } from "@/components/ConfigForm";
import { docs } from "@/content/copy";

export const metadata: Metadata = {
  title: docs.config,
};

export default function ConfigPage() {
  return <ConfigForm />;
}
