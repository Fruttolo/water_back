import express from 'express';

import { deleteUser } from '../controllers/user';
import { isAuthenticated } from '../middleware';

export default (router: express.Router) => {
    router.delete('/user', isAuthenticated, deleteUser);
};