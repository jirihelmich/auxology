import { useCallback } from 'react';
import bcrypt from 'bcryptjs';
import { useDatabase } from '../contexts/DatabaseContext';
import type { User } from '../types/database';

export function useUser() {
  const { db } = useDatabase();

  const create = useCallback(async (username: string, password: string): Promise<User> => {
    if (!db) throw new Error('Database not ready');

    const userTable = db.getSchema().table('User');
    const existing = await db.select().from(userTable).where(userTable['username'].eq(username)).exec();
    if (existing.length > 0) throw new Error('USERNAME_EXISTS');

    const encrypted = await bcrypt.hash(password, 10);

    const addressTable = db.getSchema().table('Address');
    const addressRow = addressTable.createRow({});
    const addressResults = await db.insertOrReplace().into(addressTable).values([addressRow]).exec();
    if (!addressResults.length) throw new Error('Address insert returned empty result');
    const addressId = (addressResults[0] as Record<string, unknown>).id;

    const personTable = db.getSchema().table('Person');
    const personRow = personTable.createRow({ addressId });
    const personResults = await db.insertOrReplace().into(personTable).values([personRow]).exec();
    if (!personResults.length) throw new Error('Person insert returned empty result');
    const personId = (personResults[0] as Record<string, unknown>).id;

    const userRow = userTable.createRow({
      username,
      password: encrypted,
      personId,
    });
    const userResults = await db.insertOrReplace().into(userTable).values([userRow]).exec();
    if (!userResults.length) throw new Error('User insert returned empty result');
    return userResults[0] as unknown as User;
  }, [db]);

  const getByUsername = useCallback(async (username: string): Promise<User[]> => {
    if (!db) throw new Error('Database not ready');
    const userTable = db.getSchema().table('User');
    const result = await db.select().from(userTable).where(userTable['username'].eq(username)).exec();
    return result as unknown as User[];
  }, [db]);

  return { create, getByUsername };
}
