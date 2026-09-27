import { a11y } from "@/content/copy";

export function SkipLink() {
  return (
    <a href="#timer" className="skip-link">
      {a11y.skipLink}
    </a>
  );
}
