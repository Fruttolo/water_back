import express from "express";
import { makeCoffee, manopola, accendi, setSecondi, spegni, associate, man, blu, acc } from "../controllers/coffeemachine";
import { isAuthenticated } from '../middleware';

export default (router: express.Router) => {
    router.get('/coffemachine/makecoffe',isAuthenticated, makeCoffee);
    router.get('/coffemachine/manopola',isAuthenticated, manopola);
    router.get('/coffemachine/accendi',isAuthenticated, accendi);
    router.get('/coffemachine/setsecondi',isAuthenticated, setSecondi);
    router.get('/coffemachine/spegni',isAuthenticated, spegni);
    router.post('/coffemachine/associate',isAuthenticated, associate);

    router.get('/coffemachine/man',isAuthenticated, man);
    router.get('/coffemachine/blu',isAuthenticated, blu);
    router.get('/coffemachine/acc',isAuthenticated, acc);
};