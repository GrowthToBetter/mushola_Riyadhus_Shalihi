import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";


export const metadata: Metadata = {
  title: "Musholla Riyadhus Shalihi",
  description: "berlokasi di Taman Mutiara Cinere",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
