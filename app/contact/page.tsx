'use client'; 
import { useState } from 'react';

export default function Contact() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);


    if (!email.includes('@')) {
      setError('Email musi zawierać @');
      return;
    }
    if (message.length < 5) {
      setError('Wiadomość musi mieć minimum 5 znaków.');
      return;
    }


    setSuccess(true);
    setEmail('');
    setMessage('');
  };

  return (
    <section className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">Skontaktuj się z nami</h2>
      

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">Wiadomość wysłana!</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full p-2 border rounded"
            placeholder="twoj@email.com"
          />
        </div>
        <div>
          <label className="block mb-1">Wiadomość</label>
          <textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border rounded"
            rows={4}
          />
        </div>
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Wyślij
        </button>
      </form>
    </section>
  );
} 