import "./globals.css";

export const metadata = {
  title: "Sweety • Futures Dashboard",
  description: "Cute futures risk analysis dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
