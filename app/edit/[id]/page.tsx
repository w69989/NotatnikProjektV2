import db from '@/app/baza/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Save, ArrowLeft, Edit3 } from 'lucide-react';

type Note = {
  id: number;
  title: string;
  content: string;
};

async function updateNote(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  if (title && content) {

    await db.execute({
      sql: 'UPDATE notes SET title = ?, content = ? WHERE id = ?',
      args: [title, content, id]
    });
    redirect('/');
  }
}

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;


  const result = await db.execute({
    sql: 'SELECT * FROM notes WHERE id = ?',
    args: [id]
  });
  

  const note = result.rows[0] as unknown as Note;

  if (!note) return <div className="p-10 text-center">Nie znaleziono notatki.</div>;

  return (
    <main className="max-w-2xl mx-auto p-10 font-sans">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
          <ArrowLeft size={24} className="text-gray-600" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Edit3 size={32} className="text-blue-600" />
          Edycja notatki
        </h1>
      </div>

      <form action={updateNote} className="flex flex-col gap-6 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <input type="hidden" name="id" value={id} />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tytuł notatki</label>
          <input 
            name="title" 
            defaultValue={note.title} 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Treść</label>
          <textarea 
            name="content" 
            defaultValue={note.content} 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-48 transition resize-none" 
            required
          />
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-100 mt-2">
            <Link 
              href="/" 
              className="flex-1 py-3 px-4 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition text-center"
            >
              Anuluj
            </Link>
            
            <button type="submit" className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
              <Save size={20} />
              Zapisz zmiany
            </button>
        </div>
      </form>
    </main>
  );
}