import Link from 'next/link';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body className="flex flex-col min-h-screen">

        <header className="bg-slate-900 text-white p-4">
          <nav className="container mx-auto flex justify-between items-center">
            <div className="text-xl font-bold">Inteligentny Notatnik</div>
            <ul className="flex gap-4">
              <li><Link href="/" className="hover:text-blue-400">Home</Link></li>
              <li><Link href="/about" className="hover:text-blue-400">O nas</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400">Kontakt</Link></li>
            </ul>
          </nav>
        </header>


        <main className="flex-grow container mx-auto p-4">
          {children}
        </main>


        <footer className="bg-slate-100 text-center p-4 mt-8 border-t">
          <p>&copy; 2026 Inteligentny Notatnik</p>
        </footer>
      </body>
    </html>
  );
} 