import db from './baza/db';
import { revalidatePath } from 'next/cache';

type Note = {
  id: number;
  title: string;
  content: string;
  created_at?: string;
};

async function addNote(formData: FormData) {
  'use server';
  
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  if (title && content) {
    const stmt = db.prepare('INSERT INTO notes (title, content) VALUES (?, ?)');
    stmt.run(title, content);
    revalidatePath('/');
  }
}

export default function Home() {
  const notes = db.prepare('SELECT * FROM notes ORDER BY id DESC').all() as Note[];

  return (
    <main className="max-w-4xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Lokalny Notatnik (SQLite)</h1>

      <div className="bg-gray-100 p-6 rounded-lg mb-10 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Dodaj nową notatkę</h2>
        <form action={addNote} className="flex flex-col gap-4">
          <input 
            name="title" 
            placeholder="Tytuł notatki" 
            className="p-2 border rounded" 
            required
          />
          <textarea 
            name="content" 
            placeholder="Treść notatki" 
            className="p-2 border rounded" 
            rows={3} 
            required
          />
          <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Zapisz w bazie
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notes.map((note) => (
          <div key={note.id} className="border p-5 rounded-lg shadow hover:shadow-md transition bg-white">
            <h3 className="font-bold text-lg mb-2 text-blue-800">{note.title}</h3>
            <p className="text-gray-700">{note.content}</p>
            <p className="text-xs text-gray-400 mt-4">ID: {note.id}</p>
          </div>
        ))}
        
        {notes.length === 0 && (
          <p className="text-gray-500 text-center col-span-2">Baza jest pusta.</p>
        )}
      </div>
    </main>
  );
}