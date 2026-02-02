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
// --- LOGIN ---
export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;


  const result = await db.execute({
    sql: 'SELECT * FROM users WHERE email = ?',
    args: [email]
  });

  const user = result.rows[0] as unknown as User | undefined;

  if (user && bcrypt.compareSync(password, user.password)) {
    (await cookies()).set('userId', user.id.toString(), { httpOnly: true, maxAge: 60 * 60 * 24 * 7 });
    redirect('/');
  } else {
    redirect('/?error=login_failed');
  }
}
// --- REJESTRACJA ---
export async function register(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;


  const existing = await db.execute({
    sql: 'SELECT * FROM users WHERE email = ?',
    args: [email]
  });

  if (existing.rows.length > 0) {
    redirect('/?error=email_exists');
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  
  const result = await db.execute({
    sql: 'INSERT INTO users (email, password) VALUES (?, ?)',
    args: [email, hashedPassword]
  });

  (await cookies()).set('userId', result.lastInsertRowid!.toString(), { httpOnly: true, maxAge: 60 * 60 * 24 * 7 });
  redirect('/');
}
// --- WYLOGOWANIE ---
export async function logout() {
  (await cookies()).delete('userId');
  redirect('/');
}
// --- SESJA ---
export async function getSession() {
  const userId = (await cookies()).get('userId')?.value;
  if (!userId) return null;
  return userId;
}