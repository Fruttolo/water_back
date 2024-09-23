import express from 'express';
import { get } from 'lodash';
import { deleteUserById, getUserById, updateUserById } from '../db/users';

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

export const getUser = async (req: express.Request, res: express.Response) => {
    try{

        const user = get(req, 'identity');
        const id = get(user, 'id');

        const checkUser = await getUserById(parseInt(id));

        if(!checkUser){
            return res.status(400).json({ error: 'Utente non esistente' });
        }

        const response = {
            username: checkUser.username,
            role: checkUser.role,
        }

        return res.status(200).json({ user: response });

    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
}

export const updateUser = async (req: express.Request, res: express.Response) => {
    try{

        const user = get(req, 'identity');
        const id = get(user, 'id');
        const username = get(user, 'username');

        console.log(id, username,'update user');

        const checkUser = await getUserById(parseInt(id));

        if(!checkUser){
            return res.status(400).json({ error: 'Utente non esistente' });
        }

        const { new_role } = req.body;

        if(!new_role){
            return res.status(400).json({ error: 'Nuovo username o ruolo non presente' });
        }

        await updateUserById(parseInt(id), username, new_role);

        console.log(id, username,'user updated');
        return res.status(200).end();

    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
}