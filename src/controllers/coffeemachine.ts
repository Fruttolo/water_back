import express from 'express';
import { forEach, get } from 'lodash';
import { wss } from '../index';
import { getCoffeeMachineByUserId, associateCoffeeMachine } from '../db/coffeemachines';

export const makeCoffee = async (req: express.Request, res: express.Response) => {
    try{
        const id  = get(req, 'identity.id') as string;

        const coffeeMachines = await getCoffeeMachineByUserId(parseInt(id));

        const clients = wss.getClients();
        
        forEach(coffeeMachines, (coffeeMachine, index) => {
            if(clients[coffeeMachine.name]){
                console.log('send makeCoffe to client id:', coffeeMachine.name );
                clients[coffeeMachine.name].send('SetSecondi ' + coffeeMachine.quantity);
                clients[coffeeMachine.name].send('Accendi');
                setTimeout(() => {
                    clients[coffeeMachine.name].send('Manopola');
                }, coffeeMachine.seconds * 1000);
            }
        });

        return res.status(200).end();

    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
}

export const manopola = async (req: express.Request, res: express.Response) => {
    try{
        const id  = get(req, 'identity.id') as string;

        const coffeeMachines = await getCoffeeMachineByUserId(parseInt(id));

        const clients = wss.getClients();
        
        forEach(coffeeMachines, (coffeeMachine, index) => {
            if(clients[coffeeMachine.name]){
                console.log('send Manopola to client id:', coffeeMachine.name );
                clients[coffeeMachine.name].send('Manopola');
            }
        });

        return res.status(200).end();

    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
}

export const accendi = async (req: express.Request, res: express.Response) => {
    try{
        const id  = get(req, 'identity.id') as string;

        const coffeeMachines = await getCoffeeMachineByUserId(parseInt(id));

        const clients = wss.getClients();
        
        forEach(coffeeMachines, (coffeeMachine, index) => {
            if(clients[coffeeMachine.name]){
                console.log('send Accendi to client id:', coffeeMachine.name );
                clients[coffeeMachine.name].send('Accendi');
            }
        });

        return res.status(200).end();

    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
}

export const setSecondi = async (req: express.Request, res: express.Response) => {
    try{
        const id  = get(req, 'identity.id') as string;

        const coffeeMachines = await getCoffeeMachineByUserId(parseInt(id));

        const clients = wss.getClients();

        forEach(coffeeMachines, (coffeeMachine, index) => {
            if(clients[coffeeMachine.name]){
                console.log('send SetSecondi', coffeeMachine.seconds,'to client id:', coffeeMachine.name );
                clients[coffeeMachine.name].send(`SetSecondi ${coffeeMachine.seconds}`);
            }
        });

        return res.status(200).end();

    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
}

export const spegni = async (req: express.Request, res: express.Response) => {
    try{
        const id  = get(req, 'identity.id') as string;

        const coffeeMachines = await getCoffeeMachineByUserId(parseInt(id));

        const clients = wss.getClients();
        
        forEach(coffeeMachines, (coffeeMachine, index) => {
            if(clients[coffeeMachine.name]){
                console.log('send Spegni to client id:', coffeeMachine.name );
                clients[coffeeMachine.name].send('Spegni');
            }
        });

        return res.status(200).end();

    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
}

export const associate = async (req: express.Request, res: express.Response) => {
    try{
        const id  = get(req, 'identity.id') as string;
        const { nome } = req.body;

        const clients = wss.getClients();
        const notAuthenticated = wss.getNotAuthenticated();
        
        console.log('asociazione :', nome, id);

        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        
        await associateCoffeeMachine(parseInt(id), nome, token);

        if(clients[nome]){
            clients[nome].send('Associate ' + token);
        }
        if(notAuthenticated[nome]){
            notAuthenticated[nome].send('Associate ' + token);
            wss.removeNotAuthenticated(nome);
        }

        return res.status(200).end();

    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
}

export const man = async (req: express.Request, res: express.Response) => {
    try{
        const id  = get(req, 'identity.id') as string;

        const coffeeMachines = await getCoffeeMachineByUserId(parseInt(id));

        const clients = wss.getClients();

        const state = parseInt(get(req, 'query.state') as string);
        
        forEach(coffeeMachines, (coffeeMachine, index) => {
            if(clients[coffeeMachine.name]){
                if(state){
                    clients[coffeeMachine.name].send('MAN_ON');
                }else{
                    clients[coffeeMachine.name].send('MAN_OFF');
                }
            }
        });

        return res.status(200).end();

    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
}

export const acc = async (req: express.Request, res: express.Response) => {
    try{
        const id  = get(req, 'identity.id') as string;

        const coffeeMachines = await getCoffeeMachineByUserId(parseInt(id));

        const clients = wss.getClients();

        const state = parseInt(get(req, 'query.state') as string);
        
        forEach(coffeeMachines, (coffeeMachine, index) => {
            if(clients[coffeeMachine.name]){
                if(state){
                    clients[coffeeMachine.name].send('ACC_ON');
                }else{
                    clients[coffeeMachine.name].send('ACC_OFF');
                }
            }
        });

        return res.status(200).end();

    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
}

export const blu = async (req: express.Request, res: express.Response) => {
    try{
        const id  = get(req, 'identity.id') as string;

        const coffeeMachines = await getCoffeeMachineByUserId(parseInt(id));

        const clients = wss.getClients();

        const state = parseInt(get(req, 'query.state') as string);
        
        forEach(coffeeMachines, (coffeeMachine, index) => {
            if(clients[coffeeMachine.name]){
                if(state){
                    clients[coffeeMachine.name].send('BLU_ON');
                }else{
                    clients[coffeeMachine.name].send('BLU_OFF');
                }
            }
        });

        return res.status(200).end();

    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
}