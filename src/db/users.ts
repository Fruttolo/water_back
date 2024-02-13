import { db } from '../index';

export const getUsers = () => {
    return db.any('SELECT * FROM users');
}

export const getUserByEmail = (email: string) => {
    return db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
}

export const getUserBySessionToken = (sessionToken: string) => {
    return db.oneOrNone('SELECT * FROM users WHERE session_token = $1', [sessionToken]);
}

export const getUserById = (id: number) => {
    return db.oneOrNone('SELECT * FROM users WHERE id = $1', [id]);
}

export const createUser = (username: string, email: string, password: string, salt: string, sessionToken: string) => {
    return db.none('INSERT INTO users(username, email, password, salt, session_token) VALUES($1, $2, $3, $4, $5)', [username, email, password, salt, sessionToken]);
}

export const updateUserById = (id: number, username: string, email: string, password: string, salt: string, sessionToken: string) => {
    return db.none('UPDATE users SET username = $1, email = $2, password = $3, salt = $4, session_token = $5 WHERE id = $6', [username, email, password, salt, sessionToken, id]);
}

export const deleteUserById = (id: number) => {
    return db.none('DELETE FROM users WHERE id = $1', [id]);
}