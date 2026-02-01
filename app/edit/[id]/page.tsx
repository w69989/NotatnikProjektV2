import db from '@/app/baza/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';

type Note = {
  id: number;
  title: string;
  content: string;
};

async function updateNote(formData: FormData) {
  'use server';
  
  const id = formData.get('id');
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  if (title && content) {
    db.prepare('UPDATE notes SET title = ?, content = ? WHERE id = ?')
      .run(title, content, id);
    redirect('/');
  }
}


export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  

  const { id } = await params;


  console.log("Próba edycji ID:", id);


  const note = db.prepare('SELECT * FROM notes WHERE id = ?').get(Number(id)) as Note;

  if (!note) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-xl font-bold text-red-600">Błąd</h1>
        <p>Nie znaleziono w bazie notatki o ID: {id}</p>
        <Link href="/" className="text-blue-500 underline mt-4 block">Wróć do listy</Link>
      </div>
    );
  }

  return (
    <main className="max-w-xl mx-auto p-10">
      <h1 className="text-2xl font-bold mb-6">Edytuj notatkę (ID: {id})</h1>

      <form action={updateNote} className="flex flex-col gap-4 bg-white p-6 rounded shadow border">
        
        <input type="hidden" name="id" value={id} />

        <label className="font-semibold">Tytuł:</label>
        <input 
          name="title" 
          defaultValue={note.title} 
          className="p-2 border rounded" 
          required
        />

        <label className="font-semibold">Treść:</label>
        <textarea 
          name="content" 
          defaultValue={note.content} 
          className="p-2 border rounded h-32" 
          required
        />

        <div className="flex gap-2 mt-4">
            <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 w-full">
              Zapisz zmiany
            </button>
            <Link 
              href="/" 
              className="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400 text-center flex items-center justify-center"
            >
              Anuluj
            </Link>
        </div>
      </form>
    </main>
  );
}