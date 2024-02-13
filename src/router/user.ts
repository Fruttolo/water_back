import express from 'express';

import { getAllUsers, updateUser, deleteUser } from '../controllers/user';
import { isAuthenticated, isOwner } from '../middleware';

export default (router: express.Router) => {
    router.get('/users', isAuthenticated, getAllUsers);
    router.put('/users', isAuthenticated, updateUser);
    router.delete('/users', isAuthenticated, deleteUser);
};