import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import AppKitProvider from "./context";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WhaleTrack",
  description: "Realtime Web3 Trading Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <AppKitProvider>{children}</AppKitProvider>
      </body>
    </html>
  );
}