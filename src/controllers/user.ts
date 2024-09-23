import express from 'express';
import { get } from 'lodash';
import { deleteUserById, getUserById } from '../db/users';

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try{

        const user = get(req, 'identity');
        const id = get(user, 'id');
        const username = get(user, 'username');

        console.log(id, username,'delete user');    

        const checkUser = await getUserById(parseInt(id));

        if(!checkUser){
            return res.status(400).json({ error: 'Utente non esistente' });
        }

        await deleteUserById(parseInt(id));

        console.log(id, username,'user deleted');
        return res.status(200).end();

    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
}