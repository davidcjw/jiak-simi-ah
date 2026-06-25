import type { Metadata } from "next";
import "@/lib/pulze-ds/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jiak Simi Ah? 🍜",
  description: "Cannot decide what to eat in Singapore? Let us settle for you lah!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
