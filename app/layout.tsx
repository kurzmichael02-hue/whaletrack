import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppKitProvider from "./context";
import Sidebar, { DesktopSidebar, MenuProvider } from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Ticker from "./components/Ticker";

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
          <MenuProvider>
            <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
              <div className="desktop-sidebar">
                <DesktopSidebar />
              </div>
              <Sidebar />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, width: "100%" }}>
                <Navbar />
                <Ticker />
                <main style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
                  {children}
                </main>
              </div>
            </div>
          </MenuProvider>
        </AppKitProvider>
      </body>
    </html>
  );
}