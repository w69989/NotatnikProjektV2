import db from './baza/db';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

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
    <main className="max-w-4xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Notatnik</h1>


      <div className="bg-gray-100 p-6 rounded-lg mb-10 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Dodaj notatkę</h2>
        <form action={addNote} className="flex flex-col gap-4">
          <input 
            name="title" 
            placeholder="Tytuł..." 
            className="p-2 border rounded focus:outline-blue-500" 
            required
          />
          <textarea 
            name="content" 
            placeholder="Treść..." 
            className="p-2 border rounded focus:outline-blue-500" 
            rows={3} 
            required
          />
          <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
            Dodaj
          </button>
        </form>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notes.map((note) => (
          <div key={note.id} className="border p-5 rounded-lg shadow-sm bg-white hover:shadow-md transition relative group">
            
            <h3 className="font-bold text-lg mb-2 text-gray-800 pr-8">{note.title}</h3>
            <p className="text-gray-600 mb-4 whitespace-pre-wrap">{note.content}</p>
            
            <div className="flex justify-between items-end mt-4">
               <span className="text-xs text-gray-400">ID: {note.id}</span>

               <form action={deleteNote}>
                 <input type="hidden" name="id" value={note.id} />
                 
                 <button 
                   type="submit" 
                   className="bg-red-100 text-red-600 px-3 py-1 rounded text-sm hover:bg-red-600 hover:text-white transition"
                 >
                   Usuń
                 </button>
<Link 
  href={`/edit/${note.id}`} 
  className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded text-sm hover:bg-yellow-500 hover:text-white transition mr-2"
>
  Edytuj
</Link>
               </form>
            </div>

          </div>
        ))}
        
        {notes.length === 0 && (
          <p className="text-gray-500 text-center col-span-2 py-10">
            Pusto tutaj... Dodaj pierwszą notatkę!
          </p>
        )}
      </div>
    </main>
  );
}