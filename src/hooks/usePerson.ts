import { useCallback } from 'react';
import { useDatabase } from '../contexts/DatabaseContext';
import { useAuth } from '../contexts/AuthContext';
import type { Person } from '../types/database';

export function usePerson() {
  const { db } = useDatabase();
  const { currentUser } = useAuth();

  const getCurrentDoctor = useCallback(async (): Promise<Person | null> => {
    if (!db || !currentUser) return null;
    const personTable = db.getSchema().table('Person');
    const results = await db.select()
      .from(personTable)
      .where(personTable['id'].eq(currentUser.personId))
      .exec();
    return results.length > 0 ? (results[0] as unknown as Person) : null;
  }, [db, currentUser]);

  const update = useCallback(async (person: Person): Promise<void> => {
    if (!db) throw new Error('Database not ready');
    const personTable = db.getSchema().table('Person');
    const personRow = personTable.createRow(person as unknown as Record<string, unknown>);
    await db.insertOrReplace().into(personTable).values([personRow]).exec();
  }, [db]);

  return { getCurrentDoctor, update };
}
