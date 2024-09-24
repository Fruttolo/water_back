import express from "express";
import { makeCoffee, manopola, accendi, spegni, associate, man, blu, acc } from "../controllers/coffeemachine";
import { isAdmin, isAuthenticated } from '../middleware';

export default (router: express.Router) => {
    router.get('/coffemachine/makecoffe',isAuthenticated, makeCoffee);
    router.get('/coffemachine/manopola',isAuthenticated, manopola);
    router.get('/coffemachine/accendi',isAuthenticated, accendi);
    router.get('/coffemachine/spegni',isAuthenticated, spegni);
    router.post('/coffemachine/associate',isAuthenticated, isAdmin, associate);

    router.get('/coffemachine/man',isAuthenticated, isAdmin, man);
    router.get('/coffemachine/blu',isAuthenticated, isAdmin, blu);
    router.get('/coffemachine/acc',isAuthenticated, isAdmin, acc);
};