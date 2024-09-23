import express from "express";
import { register , login, check } from "../controllers/authentication";
import { isAuthenticated } from '../middleware';

export default (router: express.Router) => {
    router.post('/auth/register',isAuthenticated, register);
    router.post('/auth/login', login);
    router.get('/auth/check',isAuthenticated, check);
};