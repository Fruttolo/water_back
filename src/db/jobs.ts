import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

const dbPromise = open({
  filename: './mydb.sqlite',
  driver: sqlite3.Database
});

export const getJobs = async () => {
    const db = await dbPromise;
    return db.all('SELECT * FROM jobs');
}

export const getJobsByUserId = async (userId: number) => {
    const db = await dbPromise;
    return db.all('SELECT * FROM jobs WHERE user_id = ?', userId);
}

export const deleteJobById = async (id: number) => {
    const db = await dbPromise;
    return db.run('DELETE FROM jobs WHERE id = ?', id);
}

// await createJob(parseInt(id), coffeeMachine.id, time, quantity ? quantity : coffeeMachine.quantity);
export const createJob = async (userId: number, coffeeMachineId: number, time: string, quantity: number, seconds: number) => {
    const db = await dbPromise;
    return db.run('INSERT INTO jobs(user_id, coffee_machine_id, time, quantity, seconds) VALUES(?, ?, ?, ?, ?)', userId, coffeeMachineId, time, quantity, seconds);
}