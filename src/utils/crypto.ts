/**
 * Cryptographic security utilities for the German Exam Platform
 * Provides real Web Crypto API salted SHA-256 password hashing and AES-GCM simulation
 */

export async function generateSalt(length = 16): Promise<string> {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function hashPassword(
  password: string,
  salt?: string
): Promise<{ hash: string; salt: string }> {
  const effectiveSalt = salt || (await generateSalt());
  const encoder = new TextEncoder();
  const data = encoder.encode(password + '::salt::' + effectiveSalt);
  
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return { hash: hashHex, salt: effectiveSalt };
}

export async function verifyPassword(
  password: string,
  storedHash: string,
  salt: string
): Promise<boolean> {
  const { hash } = await hashPassword(password, salt);
  return hash === storedHash;
}

export function evaluatePasswordStrength(password: string): {
  score: number; // 0 to 4
  label: string;
  feedback: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  switch (score) {
    case 0:
    case 1:
      return { score, label: 'Schwach', feedback: 'Mindestens 8 Zeichen, Großbuchstaben und Zahlen verwenden.' };
    case 2:
      return { score, label: 'Mäßig', feedback: 'Fügen Sie Sonderzeichen und Zahlen hinzu.' };
    case 3:
      return { score, label: 'Gut', feedback: 'Gute Sicherheit. Ein Sonderzeichen macht es optimal.' };
    case 4:
    default:
      return { score: 4, label: 'Sehr sicher', feedback: 'Hervorragendes, sicheres Kennwort.' };
  }
}
