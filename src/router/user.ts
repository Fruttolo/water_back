import express from 'express';

import { deleteUser, getUser, updateUser, makeAdmin } from '../controllers/user';
import { isAdmin, isAuthenticated } from '../middleware';

export default (router: express.Router) => {
    router.delete('/user', isAuthenticated, deleteUser);
    router.get('/user', isAuthenticated, getUser);
    router.put('/user', isAuthenticated, updateUser);
    router.put('/user/makeadmin', isAuthenticated, isAdmin, makeAdmin);
};