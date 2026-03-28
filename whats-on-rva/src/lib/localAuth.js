/**
 * Browser-only accounts (localStorage + SHA-256). Fine for demos and personal builds.
 * For production with multiple devices, replace with Supabase / Clerk / your API.
 */

const USERS_KEY = 'rva_auth_accounts_v1';
const SESSION_KEY = 'rva_auth_session_v1';

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function localRegister(email, password) {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    throw new Error('Enter a valid email address.');
  }
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters.');
  }
  const users = readUsers();
  if (users.some((u) => u.email === normalized)) {
    throw new Error('An account with that email already exists.');
  }
  const hash = await sha256(password);
  users.push({ email: normalized, hash, createdAt: new Date().toISOString() });
  writeUsers(users);
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email: normalized }));
  return { email: normalized };
}

export async function localLogin(email, password) {
  const normalized = email.trim().toLowerCase();
  const users = readUsers();
  const hash = await sha256(password);
  const u = users.find((x) => x.email === normalized);
  if (!u || u.hash !== hash) {
    throw new Error('Email or password is incorrect.');
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email: normalized }));
  return { email: normalized };
}

export function localLogout() {
  localStorage.removeItem(SESSION_KEY);
}

export function readSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
