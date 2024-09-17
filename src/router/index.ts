import express from 'express';

import authentication from './authentication';
import user from './user';
import coffemachine from './coffemachine';

const router = express.Router();

export default (): express.Router => {
    authentication(router);
    user(router);
    coffemachine(router);
    return router;
};