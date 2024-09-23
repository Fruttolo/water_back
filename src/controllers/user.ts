import express from 'express';
import { get } from 'lodash';
import { deleteUserById, getUserById, getUsers, updateUserById } from '../db/users';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try{
        const id  = get(req, 'identity.id') as string;

        const users = await getUsers();

        console.log(new Date(),'users fetched');
        return res.status(200).json(users.map(user => ({
            id: user.id,
            username: user.username,
            email: user.email,
        })));

    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try{

        const id  = get(req, 'identity.id') as string;

        await deleteUserById(parseInt(id));

        console.log(id,'user deleted');
        return res.status(200).end();

    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
}

export const updateUser = async (req: express.Request, res: express.Response) => {
    try{

        const id  = get(req, 'identity.id') as string;
        const { username } = req.body;
        console.log(username, id);

        const user = await getUserById(parseInt(id));

        await updateUserById(
            parseInt(id),
            username,
            user.email,
            user.password,
            user.salt,
            user.session_token
        );

        console.log(new Date(),'user updated');
        return res.status(200).end();

    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
}