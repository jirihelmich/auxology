import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import bcrypt from 'bcryptjs';
import toast from 'react-hot-toast';
import { useDatabase } from './DatabaseContext';
import type { User } from '../types/database';

interface AuthContextValue {
  currentUser: User | null;
  signIn: (username: string, password: string) => Promise<User | false>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  currentUser: null,
  signIn: async () => false,
  signOut: () => {},
});

const STORAGE_KEY = 'auxology.currentUser';

function loadUser(): User | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { db } = useDatabase();
  const [currentUser, setCurrentUser] = useState<User | null>(loadUser);

  const signIn = useCallback(async (username: string, password: string): Promise<User | false> => {
    if (!db) {
      console.error('signIn: db is null');
      return false;
    }
    const userTable = db.getSchema().table('User');
    const users = await db.select().from(userTable).where(userTable['username'].eq(username)).exec();
    if (!users || users.length === 0) return false;

    const user = users[0] as unknown as User;
    const match = await bcrypt.compare(password, user.password);
    if (!match) return false;

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setCurrentUser(user);
    toast.success('Přihlášení proběhlo úspěšně.');
    return user;
  }, [db]);

  const signOut = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setCurrentUser(null);
    toast.success('Odhlášení proběhlo úspěšně.');
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
