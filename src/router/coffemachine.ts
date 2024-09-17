import express from "express";
import { makeCoffee, manopola, accendi, setSecondi, spegni, associate } from "../controllers/coffeemachine";
import { isAuthenticated } from '../middleware';

export default (router: express.Router) => {
    router.get('/coffemachine/makecoffe',isAuthenticated, makeCoffee);
    router.get('/coffemachine/manopola',isAuthenticated, manopola);
    router.get('/coffemachine/accendi',isAuthenticated, accendi);
    router.get('/coffemachine/setsecondi',isAuthenticated, setSecondi);
    router.get('/coffemachine/spegni',isAuthenticated, spegni);
    router.get('/coffemachine/associate',isAuthenticated, associate);
};