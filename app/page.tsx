import db from '@/app/baza/db';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { Pencil, Trash2, PlusCircle, Sparkles, LogOut, User, Lock, Tag, Calendar, Search, X, StickyNote } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { login, register, logout, getSession } from '@/app/auth';

// --- TYPY ---
type Note = {
  id: number;
  title: string;
  content: string;
  color: string;
  summary?: string;
  tags?: string;
  created_at: string;
};

const colors: Record<string, string> = {
  blue: 'bg-blue-50 border-l-4 border-blue-500',
  green: 'bg-green-50 border-l-4 border-green-500',
  red: 'bg-red-50 border-l-4 border-red-500',
  yellow: 'bg-yellow-50 border-l-4 border-yellow-500',
};

const colorOptions = [
  { value: 'blue', label: 'Standard' },
  { value: 'green', label: 'Osobiste' },
  { value: 'red', label: 'Ważne' },
  { value: 'yellow', label: 'Pomysły' },
];

// --- AI ---
async function analyzeTextWithAI(text: string) {
  try {
    // https://www.youtube.com/watch?v=njDSd8e6o70
    const apiKey = process.env.GEMINI_API_KEY; 
    if (!apiKey) throw new Error("Brak klucza API");

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      Jesteś asystentem notatnika. Przeanalizuj ten tekst: "${text}".
      1. Napisz bardzo krótkie streszczenie (max 1 zdanie).
      2. Wypisz 3 najważniejsze słowa kluczowe (tagi) oddzielone przecinkami.
      Zwróć odpowiedź w formacie JSON: {"summary": "...", "tags": "..."}
      Nie dodawaj żadnych markdownów, czysty JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash", 
      contents: prompt,
    });
    const responseText = response.text ? response.text.toString() : ''; 
    
    if (!responseText) throw new Error("Pusta odpowiedź AI");

    const jsonString = responseText.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonString);

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("--- AI NOWA BIBLIOTEKA BŁĄD ---", errorMessage);
    const fakeSummary = text.length > 60 ? text.substring(0, 60) + "..." : text;
    const words = text.split(' ').filter(w => w.length > 4);
    const fakeTags = words.slice(0, 3).join(', ') || "notatka, ogólne";

    return { 
      summary: `(Offline) ${fakeSummary}`, 
      tags: fakeTags 
    };
  }
}

// --- AKCJE CRUD ---

async function addNote(formData: FormData) {
  'use server';
  const userId = await getSession();
  if (!userId) return;

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const color = formData.get('color') as string || 'blue';

  if (title && content) {
    const aiData = await analyzeTextWithAI(content);
    
    await db.execute({
      sql: 'INSERT INTO notes (user_id, title, content, color, summary, tags) VALUES (?, ?, ?, ?, ?, ?)',
      args: [userId, title, content, color, aiData.summary, aiData.tags]
    });
    revalidatePath('/');
  }
}

async function deleteNote(formData: FormData) {
  'use server';
  const id = formData.get('id');
  await db.execute({
    sql: 'DELETE FROM notes WHERE id = ?',
    args: [id as string]
  });
  revalidatePath('/');
}

// --- POBIERANIE DANYCH ---

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string, mode?: string }> }) {
  const params = await searchParams;
  const query = params.q || '';
  const mode = params.mode || 'login';
  
  const userId = await getSession();

  if (!userId) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md text-center">
          <div className="flex justify-center mb-6 text-blue-600"><Lock size={64} /></div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Witaj w Notatniku</h1>
          <p className="text-gray-500 mb-8">Zaloguj się, aby uzyskać dostęp.</p>

          <form action={mode === 'register' ? register : login} className="flex flex-col gap-4 text-left">
            <div><label className="text-sm font-bold text-gray-700">Email</label><input name="email" type="email" placeholder="jan@kowalski.pl" className="w-full p-3 border border-gray-300 rounded-lg" required /></div>
            <div><label className="text-sm font-bold text-gray-700">Hasło</label><input name="password" type="password" placeholder="••••••••" className="w-full p-3 border border-gray-300 rounded-lg" required /></div>
            <button className="bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition mt-2">{mode === 'register' ? 'Zarejestruj się' : 'Zaloguj się'}</button>
          </form>
          <div className="mt-6 text-sm">{mode === 'register' ? (<p>Masz już konto? <Link href="/" className="text-blue-600 font-bold hover:underline">Zaloguj się</Link></p>) : (<p>Nie masz konta? <Link href="/?mode=register" className="text-blue-600 font-bold hover:underline">Zarejestruj się</Link></p>)}</div>
        </div>
      </main>
    );
  }

  let notes: Note[] = [];
  
  if (query) {
    const res = await db.execute({
      sql: 'SELECT * FROM notes WHERE user_id = ? AND (title LIKE ? OR tags LIKE ?) ORDER BY created_at DESC',
      args: [userId, `%${query}%`, `%${query}%`]
    });
    notes = res.rows as unknown as Note[];
  } else {
    const res = await db.execute({
      sql: 'SELECT * FROM notes WHERE user_id = ? ORDER BY created_at DESC',
      args: [userId]
    });
    notes = res.rows as unknown as Note[];
  }

  return (
    <main className="max-w-4xl mx-auto p-10 font-sans">
      <div className="flex justify-between items-center mb-8">
         <div className="flex items-center gap-2 text-gray-600"><User size={20} /><span className="font-medium">Użytkownik: {userId}</span></div>
         <form action={logout}><button className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition font-medium"><LogOut size={18} /> Wyloguj</button></form>
      </div>

      <div className="flex flex-col items-center justify-center gap-3 mb-8">
        <h1 className="text-4xl font-bold text-gray-800 flex gap-3 items-center"><Sparkles className="text-purple-600" size={40}/> Notatki</h1>
        <form className="flex gap-2 w-full max-w-md mt-4 relative">
            <input name="q" defaultValue={query} placeholder="Szukaj..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <button className="bg-purple-600 text-white px-6 rounded-full hover:bg-purple-700 transition font-medium">Szukaj</button>
            {query && <Link href="/" className="flex items-center justify-center bg-gray-200 text-gray-600 w-10 rounded-full"><X size={20}/></Link>}
        </form>
      </div>

      {!query && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-10">
          <form action={addNote} className="flex flex-col gap-4">
            <div className="flex gap-4"><input name="title" placeholder="Tytuł..." className="flex-1 p-3 border border-gray-300 rounded-lg" required /><select name="color" className="p-3 border border-gray-300 rounded-lg">{colorOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
            <textarea name="content" placeholder="Treść..." className="p-3 border border-gray-300 rounded-lg h-24 resize-none" required />
            <button className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition flex items-center gap-2 font-medium justify-center"><PlusCircle size={18}/> Dodaj</button>
          </form>
        </div>
      )}

      {query && <h2 className="text-xl font-semibold mb-4 text-gray-700">Wyniki dla: <span className="text-blue-600">&quot;{query}&quot;</span> ({notes.length})</h2>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {notes.map((note) => (
          <div key={note.id} className={`p-6 rounded-xl shadow-sm hover:shadow-md transition relative flex flex-col h-auto ${colors[note.color] || colors.blue}`}>
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-xl text-gray-800 line-clamp-1 pr-2">{note.title}</h3>
                <div className="flex items-center gap-1 text-xs text-gray-500 bg-white/50 px-2 py-1 rounded-full"><Calendar size={12}/> {new Date(note.created_at).toLocaleDateString('pl-PL')}</div>
            </div>
            {note.summary && <div className="mb-3 bg-white/60 p-2 rounded-lg text-sm text-gray-800 italic border border-gray-200"><Sparkles size={12} className="inline mr-1 text-purple-600"/>{note.summary}</div>}
            <p className="text-gray-700 text-sm mb-4 line-clamp-3 whitespace-pre-wrap">{note.content}</p>
            <div className="mt-auto">
                {note.tags && <div className="flex flex-wrap gap-2 mb-4">{note.tags.split(',').map((t: string, i: number) => <span key={i} className="bg-white px-2 py-1 rounded text-xs font-semibold text-gray-600 flex items-center gap-1"><Tag size={10}/>{t.trim()}</span>)}</div>}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200/50">
                    <span className="text-xs text-gray-400">#{note.id}</span>
                    <div className="flex gap-3">
                        <Link href={`/edit/${note.id}`} className="text-blue-600 hover:underline"><Pencil size={16}/></Link>
                        <form action={deleteNote}><input type="hidden" name="id" value={note.id.toString()}/><button className="text-red-600 hover:underline"><Trash2 size={16}/></button></form>
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>
      {notes.length === 0 && <div className="text-center py-20 text-gray-400"><StickyNote size={64} className="mx-auto mb-4 opacity-20" /><p className="text-lg">{query ? "Nic nie znaleziono." : "Brak notatek. Dodaj pierwszą!"}</p></div>}
    </main>
  );
}