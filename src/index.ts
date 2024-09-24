import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import router from './router';
import pgPromise from 'pg-promise';
import * as sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import WebSocketServer from './helpers/webSocketServer';
import dotenv from 'dotenv';
import Scheduler from './helpers/cronjob';

/* const pgp = pgPromise({});
export const db = pgp('postgres://postgres:gattino@localhost:5432/mydb'); */

// Initialize SQLite database
const dbPromise = open({
    filename: './mydb.sqlite',
    driver: sqlite3.Database
});

export const db = dbPromise;

const app = express();

dotenv.config();

app.use(cors({
    credentials: true,
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

export const wss = new WebSocketServer();

server.listen(8080, () => {
    console.log('Server listening on port http://localhost:8080/');
});

app.use('/', router());

export const scheduler = new Scheduler();
