import express from 'express';

import { getMenu, addMenu, deleteMenu } from '../controllers/menu';
import { isAuthenticated } from '../middleware';

export default (router: express.Router) => {
    router.delete('/menu/:menu_id', isAuthenticated, deleteMenu);
    router.get('/menu', isAuthenticated, getMenu);
    router.post('/menu', isAuthenticated, addMenu);
};