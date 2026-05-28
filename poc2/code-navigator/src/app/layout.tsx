import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Code Navigator",
  description: "Living Documentation for Modern Development",
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <head>
        <meta name="color-scheme" content="dark" />
      </head>
      <body>{children}</body>
    </html>
  );
}
