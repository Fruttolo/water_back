import express from "express";
import { register , login, refresh, check } from "../controllers/authentication";
import { isAuthenticated } from '../middleware';

export default (router: express.Router) => {
    router.post('/auth/register', register);
    router.post('/auth/login', login);
    router.post('/auth/refresh', refresh);
    router.get('/auth/check', isAuthenticated, check);
};