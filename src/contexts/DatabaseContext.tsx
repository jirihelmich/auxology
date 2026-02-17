import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import lf from 'lovefield';
import { getDB } from '../lib/lovefield';

interface DatabaseContextValue {
  db: lf.Database | null;
  loading: boolean;
}

const DatabaseContext = createContext<DatabaseContextValue>({ db: null, loading: true });

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<lf.Database | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDB().then((database) => {
      setDb(database);
      setLoading(false);
    }).catch((err) => {
      console.error('Failed to connect to database:', err);
      setLoading(false);
    });
  }, []);

  return (
    <DatabaseContext.Provider value={{ db, loading }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase(): DatabaseContextValue {
  return useContext(DatabaseContext);
}
