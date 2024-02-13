import * as fs from 'fs';
import * as path from 'path';
import { db } from '../../index';

const folderPath = path.join(__dirname, '../');

async function migration(sqlQuery: string, version: number) {
    try {
        await db.query('BEGIN');
        await db.query(sqlQuery);
        await db.query('INSERT INTO schema_migrations (version) VALUES ($1)', [version]);
        await db.query('COMMIT');
    } catch (error) {
        await db.query('ROLLBACK');
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
    await db.query('SELECT MAX(version) as version FROM schema_migrations').then((version) => {
        console.log('Current version:', version[0].version);
        for (const migrationFile of migrationFiles) {
            if (migrationFile.version > version[0].version) {
                console.log('Checking migration:', migrationFile.version);
                const sqlQuery = fs.readFileSync(path.join(folderPath, migrationFile.file), 'utf8');
                migration(sqlQuery, migrationFile.version);
            }
        }
    });
}

migrate();
