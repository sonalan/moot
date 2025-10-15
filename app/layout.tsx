import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Moot | How dare you debate :)",
  description: "A fun AI chat for debaters",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header>
          <nav className="flex items-center justify-between px-6 py-4 bg-white shadow">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">Moot</span>
              <span className="text-sm text-gray-500">How dare you debate :)</span>
            </div>
            <ul className="flex items-center gap-6">
              <li>
                <a href="/" className="text-gray-700 hover:text-blue-600 transition">Home</a>
              </li>
              <li>
                <a href="/chat" className="text-gray-700 hover:text-blue-600 transition">Chat Archive</a>
              </li>
              <li>
                <a href="/about" className="text-gray-700 hover:text-blue-600 transition">About</a>
              </li>
            </ul>
            <div className="flex items-end">
              {/** social media icons will be here */}
            </div>
          </nav>
        </header>
        {children}
        <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        
        </footer>
      </body>
    </html>
  );
}
