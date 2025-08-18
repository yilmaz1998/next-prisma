import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "To-Do App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-sky-900 via-blue-800 to-indigo-900 text-white bg-fixed min-h-screen">
        {children}
      </body>
    </html>
  );
}
