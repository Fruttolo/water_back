import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import router from './router';
import pgPromise from 'pg-promise';

const pgp = pgPromise({});
export const db = pgp('postgres://postgres:gattino@localhost:5432/mydb');

const app = express();

app.use(cors({
    credentials: true,
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => {
    console.log('Server listening on port http://localhost:8080/');
});

app.use('/', router());


