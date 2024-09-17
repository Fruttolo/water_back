import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

const dbPromise = open({
  filename: './mydb.sqlite',
  driver: sqlite3.Database
});

export const getUsers = async () => {
    const db = await dbPromise;
    return db.all('SELECT * FROM users');
}

export const getUserByEmail = async (email: string) => {
    const db = await dbPromise;
    return db.get('SELECT * FROM users WHERE email = ?', email);
}

export const getUserBySessionToken = async (sessionToken: string) => {
    const db = await dbPromise;
    return db.get('SELECT * FROM users WHERE session_token = ?', sessionToken);
}

export const getUserById = async (id: number) => {
    const db = await dbPromise;
    return db.get('SELECT * FROM users WHERE id = ?', id);
}

export const createUser = async (username: string, email: string, password: string, salt: string, sessionToken: string) => {
    const db = await dbPromise;
    return db.run('INSERT INTO users(username, email, password, salt, session_token) VALUES(?, ?, ?, ?, ?)', username, email, password, salt, sessionToken);
}

export const updateUserById = async (id: number, username: string, email: string, password: string, salt: string, sessionToken: string) => {
    const db = await dbPromise;
    return db.run('UPDATE users SET username = ?, email = ?, password = ?, salt = ?, session_token = ? WHERE id = ?', username, email, password, salt, sessionToken, id);
}

export const deleteUserById = async (id: number) => {
    const db = await dbPromise;
    return db.run('DELETE FROM users WHERE id = ?', id);
}