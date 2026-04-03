// ─── Types ───────────────────────────────────────────────────────────────────

export interface UserEntry {
  name: string;
  startedAt: string; // ISO timestamp
}

// ─── Storage ─────────────────────────────────────────────────────────────────

const USERS_KEY = "perdao-users";

/** Returns the full history of user entries (oldest first). */
export function getUsers(): UserEntry[] {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as UserEntry[]) : [];
  } catch {
    return [];
  }
}

/** Returns the most recent user entry, or null if none exists. */
export function getCurrentUser(): UserEntry | null {
  const users = getUsers();
  return users[users.length - 1] ?? null;
}

/**
 * Saves a new user entry (appends to history).
 * Called both on first onboarding and on every restart.
 * The entry persists indefinitely — never auto-cleared.
 */
export function saveUser(name: string): UserEntry {
  const users = getUsers();
  const entry: UserEntry = { name, startedAt: new Date().toISOString() };
  users.push(entry);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return entry;
}
