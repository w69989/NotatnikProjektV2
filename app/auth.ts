'use server';

import { cookies } from 'next/headers';
import db from '@/app/baza/db';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

type User = {
  id: number;
  email: string;
  password: string;
};

// --- LOGOWANIE ---
export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined;

  if (user && bcrypt.compareSync(password, user.password)) {
    (await cookies()).set('userId', user.id.toString(), { httpOnly: true, maxAge: 60 * 60 * 24 * 7 });
    redirect('/');
  } else {
    console.log('Błędne dane!');
    redirect('/?error=login_failed');
  }
}

// --- REJESTRACJA ---
export async function register(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const existing = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (existing) {
    redirect('/?error=email_exists');
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const result = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)').run(email, hashedPassword);

  (await cookies()).set('userId', result.lastInsertRowid.toString(), { httpOnly: true, maxAge: 60 * 60 * 24 * 7 });
  redirect('/');
}

// --- WYLOGOWANIE ---
export async function logout() {
  (await cookies()).delete('userId');
  redirect('/');
}

// --- POBIERANIE SESJI ---
export async function getSession() {
  const userId = (await cookies()).get('userId')?.value;
  if (!userId) return null;
  return userId;
}