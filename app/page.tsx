import db from '@/app/baza/db';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

import { Pencil, Trash2, PlusCircle, StickyNote } from 'lucide-react';

type Note = {
  id: number;
  title: string;
  content: string;
};

async function addNote(formData: FormData) {
  'use server';
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  if (title && content) {
    db.prepare('INSERT INTO notes (title, content) VALUES (?, ?)').run(title, content);
    revalidatePath('/');
  }
}

async function deleteNote(formData: FormData) {
  'use server';
  const id = formData.get('id');
  if (id) {
    db.prepare('DELETE FROM notes WHERE id = ?').run(id);
    revalidatePath('/');
  }
}

export default function Home() {
  const notes = db.prepare('SELECT * FROM notes ORDER BY id DESC').all() as Note[];

  return (
    <main className="max-w-4xl mx-auto p-10 font-sans">
      

      <div className="flex items-center justify-center gap-3 mb-10">
        <StickyNote size={40} className="text-blue-600" />
        <h1 className="text-4xl font-bold text-gray-800">Twój Osobisty Inteligentny Notatnik</h1>
      </div>


      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
          <PlusCircle size={20} className="text-green-600" />
          Nowa notatka
        </h2>
        <form action={addNote} className="flex flex-col gap-4">
          <input 
            name="title" 
            placeholder="Tytuł notatki..." 
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
            required
          />
          <textarea 
            name="content" 
            placeholder="Treść notatki..." 
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition h-24 resize-none" 
            required
          />
          <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 font-medium">
            <PlusCircle size={18} />
            Dodaj notatkę
          </button>
        </form>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {notes.map((note) => (
          <div key={note.id} className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between h-64">
            
            <div>
              <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-1">{note.title}</h3>
              <p className="text-gray-600 whitespace-pre-wrap line-clamp-4 text-sm leading-relaxed">
                {note.content}
              </p>
            </div>
            
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
               <span className="text-xs text-gray-400 font-mono">#{note.id}</span>

               <div className="flex gap-3">

                  <Link 
                    href={`/edit/${note.id}`} 
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition text-sm font-medium bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100"
                  >
                    <Pencil size={16} />
                    Edytuj
                  </Link>


                  <form action={deleteNote}>
                    <input type="hidden" name="id" value={note.id} />
                    <button 
                      type="submit" 
                      className="flex items-center gap-1 text-red-600 hover:text-red-800 transition text-sm font-medium bg-red-50 px-3 py-1.5 rounded-md hover:bg-red-100"
                    >
                      <Trash2 size={16} />
                      Usuń
                    </button>
                  </form>
               </div>
            </div>

          </div>
        ))}
      </div>
      
      {notes.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <StickyNote size={64} className="mx-auto mb-4 opacity-20" />
          <p className="text-lg">Pusto tu... Dodaj pierwszą notatkę!</p>
        </div>
      )}
    </main>
  );
}