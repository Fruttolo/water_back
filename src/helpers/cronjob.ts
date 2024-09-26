import schedule from 'node-schedule';
import { createJob, deleteJobById, getJobs } from '../db/jobs';
import { create, forEach } from 'lodash';
import { wss } from '../index';
import { faiCaffe } from '../controllers/coffeemachine';
import { getCoffeeMachineById } from '../db/coffeemachines';

export default class Scheduler {

    private JOBS: any; 

    constructor() {
        this.JOBS = {};
        this.loadCronJobs();
    }

    async loadCronJobs() {
        const jobs = await getJobs();

        forEach(jobs, async (job) => {
            const coffeeMachine = await getCoffeeMachineById(job.coffee_machine_id);
            const time = job.time;
            const quantity = job.quantity;
            const seconds = job.seconds;
            const functionToCall = async () => {
                const client = wss.getClient(coffeeMachine.name);
                if(client){
                    await faiCaffe(client, seconds ? seconds : coffeeMachine.seconds, quantity ? quantity : coffeeMachine.quantity);
                }
            }
            console.log('Job loaded:', coffeeMachine.name, time);
            const J = schedule.scheduleJob(time, functionToCall);
            this.JOBS[job.id] = J;
        });

        console.log('Cron jobs loaded');
    }

    public async scheduleJob(time: string, job: any) {
        const db = await createJob(parseInt(job.userId), job.coffeeMachineId, time, job.quantity, job.seconds);
        const sched = schedule.scheduleJob(time, job.functionToCall);
        this.JOBS[db.lastID] = sched;
        console.log('Job scheduled:', time);
    }

    public async deleteJob(id: number) {
        const job = this.JOBS[id];
        if(job){
            job.cancel();
            delete this.JOBS[id];
        }
        await deleteJobById(id);
        console.log('Job deleted:', id);
    }
}