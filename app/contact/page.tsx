import db from '@/app/baza/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Send, Mail, CheckCircle } from 'lucide-react';
async function sendMessage(formData: FormData) {
  'use server';
  
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const content = formData.get('content') as string;

  if (name && email && content) {
    await db.execute({
      sql: 'INSERT INTO messages (name, email, content) VALUES (?, ?, ?)',
      args: [name, email, content]
    });
    
    redirect('/contact?sent=true');
  }
}

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ sent?: string }> }) {
  const params = await searchParams;
  const isSent = params.sent === 'true';

  return (
    <main className="min-h-screen bg-gray-50 p-6 flex items-center justify-center font-sans">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 p-8 text-white">
            <Link href="/" className="inline-flex items-center gap-2 text-blue-100 hover:text-white transition mb-6">
                <ArrowLeft size={18} /> Wróć do notatek
            </Link>
            <h1 className="text-3xl font-bold flex items-center gap-3">
                <Mail /> Kontakt
            </h1>
            <p className="text-blue-100 mt-2 opacity-90">Masz pytania? Napisz do nas, a zapiszemy Twoją wiadomość w bazie.</p>
        </div>

        <div className="p-8">
            {isSent ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center animate-pulse">
                    <div className="flex justify-center mb-4">
                        <CheckCircle size={48} className="text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Dziękujemy!</h2>
                    <p className="text-gray-600">Twoja wiadomość została bezpiecznie zapisana w naszej bazie danych.</p>
                    <Link href="/" className="inline-block mt-6 bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition">
                        Wróć na stronę główną
                    </Link>
                </div>
            ) : (
                <form action={sendMessage} className="flex flex-col gap-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Twoje Imię</label>
                        <input name="name" type="text" placeholder="Jan Kowalski" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Adres Email</label>
                        <input name="email" type="email" placeholder="jan@przyklad.pl" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Wiadomość</label>
                        <textarea name="content" placeholder="O co chcesz zapytać?" className="w-full p-3 border border-gray-300 rounded-lg h-32 resize-none focus:ring-2 focus:ring-blue-500 outline-none" required />
                    </div>

                    <button className="bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-lg mt-2">
                        <Send size={18} /> Wyślij wiadomość
                    </button>
                </form>
            )}
        </div>
      </div>
    </main>
  );
}