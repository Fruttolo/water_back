import express from 'express';
import { forEach, get } from 'lodash';
import { wss, scheduler } from '../index';
import { getCoffeeMachineByUserId, associateCoffeeMachine } from '../db/coffeemachines';
import { random } from '../helpers/authHelper';
import { getJobsByUserId } from '../db/jobs';

export const makeCoffee = async (req: express.Request, res: express.Response) => {
    try{

        const user = get(req, 'identity');
        const id = get(user, 'id');

        const coffeeMachines = await getCoffeeMachineByUserId(parseInt(id));

        const clients = wss.getClients();

        const quantity = parseInt(get(req, 'query.quantity') as string);
        
        forEach(coffeeMachines, async (coffeeMachine, index) => {
            if(clients[coffeeMachine.name]){
                console.log('send FaiCaffe to client id:', coffeeMachine.name, 'quantity:', quantity ? quantity : coffeeMachine.quantity );
                await faiCaffe(clients[coffeeMachine.name], coffeeMachine.seconds, quantity ? quantity : coffeeMachine.quantity);
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
        const user = get(req, 'identity');
        const id = get(user, 'id');

        const coffeeMachines = await getCoffeeMachineByUserId(parseInt(id));

        const clients = wss.getClients();

        const quantity = parseInt(get(req, 'query.quantity') as string);
        
        forEach(coffeeMachines, async (coffeeMachine, index) => {
            if(clients[coffeeMachine.name]){
                console.log('send Manopola to client id:', coffeeMachine.name, 'quantity:', quantity ? quantity : coffeeMachine.quantity );
                await giraManopola(clients[coffeeMachine.name], quantity ?  quantity : coffeeMachine.quantity);
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
        const user = get(req, 'identity');
        const id = get(user, 'id');

        const coffeeMachines = await getCoffeeMachineByUserId(parseInt(id));

        const clients = wss.getClients();
        
        forEach(coffeeMachines, async (coffeeMachine, index) => {
            if(clients[coffeeMachine.name]){
                console.log('send Accendi to client id:', coffeeMachine.name );
                await switchAccensione(clients[coffeeMachine.name]);
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
        const user = get(req, 'identity');
        const id = get(user, 'id');

        const coffeeMachines = await getCoffeeMachineByUserId(parseInt(id));

        const clients = wss.getClients();
        
        forEach(coffeeMachines, async (coffeeMachine, index) => {
            if(clients[coffeeMachine.name]){
                console.log('send Spegni to client id:', coffeeMachine.name );
                switchAccensione(clients[coffeeMachine.name]);
            }
        });

        return res.status(200).end();

    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
}

export const scheduleJob = async (req: express.Request, res: express.Response) => {
    try{
        const user = get(req, 'identity');
        const id = get(user, 'id');

        const coffeeMachines = await getCoffeeMachineByUserId(parseInt(id));

        forEach(coffeeMachines, (coffeeMachine, index) => {
            const client = wss.getClient(coffeeMachine.name);
            if(client){
                // time: every 'second minute hour dayOfMonth month dayOfWeek' 'every 10 seconds' => '*/10 * * * * *'
                // every sunday and wednesday at 10:30 => '30 10 * * 0,3'
                const { time, quantity } = req.body; 
                if (!time) {
                    res.status(400).json({ error: 'Invalid or missing time format' });
                    return;
                }
                const job = {
                    functionToCall: async () => {
                        await faiCaffe(client, coffeeMachine.seconds, quantity ? quantity : coffeeMachine.quantity);
                    },
                    coffeeMachineId: coffeeMachine.id,
                    userId: id,
                    quantity: quantity ? quantity : coffeeMachine.quantity,
                    seconds: coffeeMachine.seconds
                }
                scheduler.scheduleJob(time, job);
            }
        });

        return res.status(200).end();

    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
}

export const deleteJob = async (req: express.Request, res: express.Response) => {
    try{
        const user = get(req, 'identity');
        const id = get(user, 'id');
        const { job_id } = req.params;

        if(!job_id){
            return res.status(400).json({error: 'job_id non presente'});
        }

        const jobs = await getJobsByUserId(parseInt(id));
        if(!jobs){
            return res.status(400).json({error: 'jobs non presenti'});
        }

        const myjob = jobs.find((j) => j.id === parseInt(job_id));

        if(!myjob){
            return res.status(400).json({error: 'job non presente'});
        }

        scheduler.deleteJob(parseInt(myjob.id));

        return res.status(200).end();

    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
}

export const getJobs = async (req: express.Request, res: express.Response) => {
    try{
        const user = get(req, 'identity');
        const id = get(user, 'id');

        const jobs = await getJobsByUserId(parseInt(id));

        return res.status(200).json(jobs);

    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
}

export const associate = async (req: express.Request, res: express.Response) => {
    try{
        const user = get(req, 'identity');
        const id = get(user, 'id');
        const { nome } = req.body;

        if(!nome){
            return res.sendStatus(400).json({error: 'Nome non presente'});
        }

        const clients = wss.getClients();
        const notAuthenticated = wss.getNotAuthenticated();
        
        console.log('asociazione :', nome, id);

        const token = random(32);
        
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
        const user = get(req, 'identity');
        const id = get(user, 'id');

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
        const user = get(req, 'identity');
        const id = get(user, 'id');

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
        const user = get(req, 'identity');
        const id = get(user, 'id');

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

const switchAccensione = async (client: any) => {
    console.log('Sending ACC_ON');
    client.send('ACC_ON');
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Sending ACC_OFF');
    client.send('ACC_OFF');
}

const giraManopola = async (client: any, q: number) => {
    console.log('Sending BLU_ON');
    client.send('BLU_ON');
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Sending MAN_ON');
    client.send('MAN_ON');
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Sending ACC_ON');
    client.send('ACC_ON');
    await new Promise(resolve => setTimeout(resolve, q * 1000));
    console.log('Sending ACC_OFF');
    client.send('ACC_OFF');
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Sending MAN_OFF');
    client.send('MAN_OFF');
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Sending BLU_OFF');
    client.send('BLU_OFF');
}

export const faiCaffe = async (client: any, waiting: number, quantity: number) => {
    console.log('faiCaffe Accensione');
    await switchAccensione(client);
    await new Promise(resolve => setTimeout(resolve, waiting * 1000));
    console.log('faiCaffe Manopola');
    await giraManopola(client, quantity);
}