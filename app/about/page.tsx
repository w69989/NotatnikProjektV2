import Link from 'next/link';
import { ArrowLeft, Sparkles, Database, Code, ShieldCheck } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      <div className="bg-purple-700 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
            <Sparkles size={40} className="text-yellow-300"/> Notatnik AI
        </h1>
        <p className="text-purple-100 text-xl max-w-2xl mx-auto">
            Teraz możesz skorzystac z notatnika wyposażonego w sztuczną inteligencję by uzyskać krótkie streszczenie i tagi
        </p>
      </div>

      <div className="max-w-4xl mx-auto p-8 -mt-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Nasza Misja</h2>
            <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                Ten notatnik AI zagwarantuje, że nie pominiesz żadnych istotnych szczegółów tkestów, które tu umieścisz
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Technologia</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 text-center">
                    <Code className="mx-auto text-blue-600 mb-3" size={32} />
                    <h3 className="font-bold text-gray-800">Next.js 15</h3>
                    <p className="text-sm text-gray-500 mt-2">Najnowszy standard React.</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 text-center">
                    <Database className="mx-auto text-purple-600 mb-3" size={32} />
                    <h3 className="font-bold text-gray-800">Baza danych Turso</h3>
                    <p className="text-sm text-gray-500 mt-2">Błyskawiczna baza danych SQLite w chmurze (Edge).</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 text-center">
                    <ShieldCheck className="mx-auto text-green-600 mb-3" size={32} />
                    <h3 className="font-bold text-gray-800">Bezpieczeństwo</h3>
                    <p className="text-sm text-gray-500 mt-2">Szyfrowane hasła i bezpieczne sesje HTTP-Only.</p>
                </div>
            </div>

            <div className="text-center">
                <Link href="/" className="inline-flex items-center gap-2 text-purple-600 font-bold hover:underline text-lg">
                    <ArrowLeft size={20} /> Wróć do aplikacji
                </Link>
            </div>
        </div>
      </div>
    </main>
  );
}