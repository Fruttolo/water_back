import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

const dbPromise = open({
  filename: './mydb.sqlite',
  driver: sqlite3.Database
});

export const getCoffeeMachines = async () => {
    const db = await dbPromise;
    return db.all('SELECT * FROM coffee_machines');
}

export const getCoffeeMachineById = async (id: number) => {
    const db = await dbPromise;
    return db.get('SELECT * FROM coffee_machines WHERE id = ? LIMIT 1', id);
}

export const getCoffeeMachineByUserId = async (userId: number) => {
    const db = await dbPromise;
    return db.all('SELECT * FROM coffee_machines WHERE user_id = ?', userId);
}

export const getCoffeeMachineByName = async (name: string) => {
    const db = await dbPromise;
    return db.get('SELECT * FROM coffee_machines WHERE name = ?  LIMIT 1', name);
}

export const checkCoffeeMachineToken = async (nome: string, token: string) => {
    const db = await dbPromise;
    return db.get('SELECT * FROM coffee_machines WHERE name = ? AND token = ? LIMIT 1', nome, token);
}

export const createCoffeeMachine = async (name: string) => {
    const db = await dbPromise;
    return db.run('INSERT INTO coffee_machines(name) VALUES(?)', name);
}

export const associateCoffeeMachine = async (userId: number, name: string, token: string) => {
    const db = await dbPromise;
    return db.run('UPDATE coffee_machines SET user_id = ?, token = ? WHERE name = ?', userId, token, name);
}

