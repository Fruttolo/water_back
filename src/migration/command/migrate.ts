import * as fs from 'fs';
import * as path from 'path';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

const dbPromise = open({
  filename: './mydb.sqlite',
  driver: sqlite3.Database
});

const folderPath = path.join(__dirname, '../');

async function migration(sqlQuery: string, version: number) {
    const db = await dbPromise;
    try {
        await db.exec('BEGIN');
        await db.exec(sqlQuery);
        await db.run('INSERT INTO schema_migrations (version) VALUES (?)', version);
        await db.exec('COMMIT');
    } catch (error) {
        await db.exec('ROLLBACK');
        console.error('An error occurred during migration:', error);
    }
}

const migrationFiles = fs.readdirSync(folderPath)
    .filter((file) => file.endsWith('.sql'))
    .sort()
    .map((file) => {
        const version = parseInt(file.split('_')[0]);
        return {
            version,
            file,
        };
    });

async function migrate() {
    const db = await dbPromise;
    await db.exec(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            version INTEGER PRIMARY KEY
        )
    `);
    const versionRow = await db.get('SELECT MAX(version) as version FROM schema_migrations');
    const currentVersion = versionRow ? versionRow.version : 0;
    console.log('Current version:', currentVersion);

    for (const migrationFile of migrationFiles) {
        if (migrationFile.version > currentVersion) {
            const sqlQuery = fs.readFileSync(path.join(folderPath, migrationFile.file), 'utf8');
            await migration(sqlQuery, migrationFile.version);
        }
    }

    console.log('Migration completed');
    console.log('New version:', (await db.get('SELECT MAX(version) as version FROM schema_migrations')).version);
}

migrate().catch((error) => {
    console.error('Migration failed:', error);
});