import { Server } from 'ws';
import { checkCoffeeMachineToken, createCoffeeMachine, getCoffeeMachineByName } from '../db/coffeemachines';

export default class WebSocketServer {
    private wss: Server;
    private clients: any;

    constructor(server: any) {
        this.wss = new Server({ server });
        this.clients = {};
        this.wss.on('connection', (ws) => {

            ws.on('message', (message) => {

                try{
                    JSON.parse(message.toString());
                }catch(error){
                    console.error(`Error parsing message: ${error}`);
                    ws.close();
                    return;
                }
                const parsedMessage = JSON.parse(message.toString());
                const token = parsedMessage.TOKEN;
                const nome = parsedMessage.ID;

                this.authenticateClient(token, nome).then((authenticated) => {
                    if (!authenticated) {
                        console.log(`Client not authenticated: ${nome}`);
                        this.addCoffeeMachine(nome);
                        ws.close();
                    }
                    else{
                        console.log(`Client connected: ${nome}`);
                        const clientId = nome.toString();
                        this.clients[clientId] = ws;
                    }
                }).catch((error) => {
                    console.error(`Authentication error: ${error}`);
                    ws.close();
                });
            });
            ws.on('close', () => {
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

    public async authenticateClient(token: string, nome: string) {
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

    protected async addCoffeeMachine(nome: string) {
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
}