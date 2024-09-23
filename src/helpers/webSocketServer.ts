import { Server } from 'ws';
import { checkCoffeeMachineToken, createCoffeeMachine, getCoffeeMachineByName } from '../db/coffeemachines';
import { set } from 'lodash';

export default class WebSocketServer {
    private wss: Server;
    private clients: any;
    private notAuthenticated: any;

    constructor() {
        this.wss = new Server({ port: 8081 });
        this.clients = {};
        this.notAuthenticated = {};
        this.startHeartbeat(30);
        this.wss.on('connection', (ws) => {

            console.log('Client connected');

            ws.on('message', (message) => {

                if(message.toString() == 'Ping' || message.toString() == 'Pong'){
                    return;
                }

                try{
                    console.log(`Received message: ${message}`);
                    JSON.parse(message.toString());
                }catch(error){
                    console.error(`Error parsing message: ${error}`);
                    return;
                }
                const parsedMessage = JSON.parse(message.toString());
                const token = parsedMessage.TOKEN;
                const nome = parsedMessage.ID;

                this.authenticateClient(token, nome).then((authenticated) => {
                    if (!authenticated) {
                        console.log(`Client not authenticated: ${nome}`);
                        this.addCoffeeMachine(nome);
                        this.notAuthenticated[nome] = ws;
                    }
                    else{
                        console.log(`Client authenticated: ${nome}`);
                        this.clients[nome] = ws;
                    }
                }).catch((error) => {
                    console.error(`Authentication error: ${error}`);
                });
            });
            ws.on('close', () => {
                for (const clientId in this.notAuthenticated) {
                    if (this.notAuthenticated[clientId] === ws) {
                        console.log(`Client disconnected: ${clientId}`);
                        delete this.notAuthenticated[clientId];
                        break;
                    }
                }
                for (const clientId in this.clients) {
                    if (this.clients[clientId] === ws) {
                        console.log(`Client disconnected: ${clientId}`);
                        delete this.clients[clientId];
                        break;
                    }
                }
            });
        });
    }

    private async startHeartbeat(interval: number) {
        const heartbeat = () => {
            //console.log('Heartbeat');
            for (const clientId in this.clients) {
                this.clients[clientId].send("Ping");
            }
            for (const clientId in this.notAuthenticated) {
                this.notAuthenticated[clientId].send("Ping");
            }
        };

        while (true) {
            heartbeat();
            await new Promise(resolve => setTimeout(resolve, interval * 1000));
        }
    }

    private async authenticateClient(token: string, nome: string) {
        if(!token || !nome){
            return false;
        }
        try {
            const check = await checkCoffeeMachineToken(nome, token);
            return check;
        } catch (error) {
            console.error(`Error checking token: ${error}`);
            return false;
        }
    }

    private async addCoffeeMachine(nome: string) {
        if(!nome){
            return;
        }
        getCoffeeMachineByName(nome).then((coffeeMachine) => { 
            if(!coffeeMachine){
                try {
                    createCoffeeMachine(nome);
                } catch (error) {
                    console.error(`Error creating coffee machine: ${error}`);
                }
            }
        }).catch((error) => {
            console.error(`Error getting coffee machine: ${error}`);
        });
    }

    public getClient(clientId: string) {
        return this.clients[clientId];
    }

    public getClients() {
        return this.clients;
    }

    public getNotAuthenticated() {
        return this.notAuthenticated;
    }

    public removeNotAuthenticated(clientId: string) {
        delete this.notAuthenticated[clientId];
    }
}