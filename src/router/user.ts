import express from 'express';

import { deleteUser, getUser, updateUser } from '../controllers/user';
import { isAuthenticated } from '../middleware';

export default (router: express.Router) => {
    router.delete('/user', isAuthenticated, deleteUser);
    router.get('/user', isAuthenticated, getUser);
    router.put('/user', isAuthenticated, updateUser);
};