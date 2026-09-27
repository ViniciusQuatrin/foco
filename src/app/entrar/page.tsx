import type { Metadata } from "next";
import { LoginForm } from "@/components/LoginForm";
import { docs } from "@/content/copy";

export const metadata: Metadata = {
  title: docs.entrar,
};

export default function EntrarPage() {
  return <LoginForm />;
}
