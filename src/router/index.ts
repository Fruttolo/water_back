import express from 'express';

import authentication from './authentication';
import user from './user';
import coffemachine from './coffemachine';
import menu from './menu';

const router = express.Router();

export default (): express.Router => {
    authentication(router);
    user(router);
    coffemachine(router);
    menu(router);
    router.get('/hello', (req, res) => {
        res.send('Hello, world!');
    });
    return router;
};