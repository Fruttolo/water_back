import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

const dbPromise = open({
  filename: './mydb.sqlite',
  driver: sqlite3.Database
});

export const getAllMenuByUserId = async (id: number) => {
    const db = await dbPromise;
    return db.all('SELECT * FROM menu WHERE deleted = 0 AND user_id = ?', id);
}

export const addMenuItem = async (description: string, id: number) => {
    const db = await dbPromise;
    return db.run('INSERT INTO menu (description, user_id) VALUES (?, ?)', description, id);
}

export const deleteMenuItem = async (id: number) => {
    const db = await dbPromise;
    return db.run('UPDATE menu SET deleted = 1 WHERE id = ?', id);
}