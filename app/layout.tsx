import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import AppKitProvider from "./context";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

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
      <body className={geist.className} style={{ background: "#0a0f1e" }}>
        <AppKitProvider>
          <div className="min-h-screen text-white flex">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
            </div>
          </div>
        </AppKitProvider>
      </body>
    </html>
  );
}