import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppKitProvider from "./context";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WhaleTrack",
  description: "Crypto Intelligence Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppKitProvider>
          <div style={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <Navbar />
              <main style={{ flex: 1, overflowY: "auto" }}>
                {children}
              </main>
            </div>
          </div>
        </AppKitProvider>
      </body>
    </html>
  );
}
