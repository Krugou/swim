import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Swimming Hall Schedules - Espoo",
  description: "Swimming halls reservation viewer for Espoo swimming halls",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
