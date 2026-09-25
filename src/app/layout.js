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

export const metadata = {
  title: "Hema Dashboard",
  description: "Portfolio risk management dashboard for Binance",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-transparent text-[#1d2433]`}
      >
        {children}
      </body>
    </html>
  );
}
