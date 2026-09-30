import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SkipLink } from "@/components/SkipLink";
import { docs, product } from "@/content/copy";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: docs.timer,
  description: product.name,
  applicationName: product.name,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

const themeBoot = `(function(){try{var t=localStorage.getItem("foco:theme");if(!t){var c=localStorage.getItem("foco:config");if(c){t=JSON.parse(c).theme}}if(t!=="light"&&t!=="dark")t="dark";document.documentElement.setAttribute("data-theme",t);if(t==="dark")document.documentElement.classList.add("dark")}catch(e){document.documentElement.setAttribute("data-theme","dark");document.documentElement.classList.add("dark")}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
      </head>
      <body className={`${display.variable} ${mono.variable}`}>
        <ThemeProvider>
          <SkipLink />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
