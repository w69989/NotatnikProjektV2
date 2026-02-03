import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Twój Osobisty Inteligentny Notatnik",
  description: "Twój notatnik w chmurze",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen flex flex-col`}>
        <div className="grow">
          {children}
        </div>
        
        <footer className="bg-white border-t border-gray-200 py-6 mt-10">
          <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} Inteligentny Notatnik</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="/about" className="hover:text-blue-600 transition">O nas</Link>
              <Link href="/contact" className="hover:text-blue-600 transition">Kontakt</Link>
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}