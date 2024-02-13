import express from 'express';
import { getUserByEmail, createUser, updateUserById, getUserBySessionToken} from '../db/users';
import { random , authentication} from '../helpers';

export const login = async (req: express.Request, res: express.Response) => {
    try{

        const { email, password } = req.body;

        if(!email || !password){
            return res.sendStatus(400);
        }

        const user = await getUserByEmail(email);

        if(!user){
            return res.sendStatus(400);
        }

        if(authentication(user.salt, password) !== user.password){
            return res.sendStatus(403);
        }

        const salt = random();
        await updateUserById(
            user.id,
            user.username,
            user.email,
            user.password,
            user.salt,
            authentication(salt, user.id.toString()),
        );

        const session = authentication(salt, user.id.toString());
        const userId = user.id;

        console.log(new Date(),'user logged in');
        return res.status(200).json({ userId, session }).end();
        
    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
}

export const check = async (req: express.Request, res: express.Response) => {
    try{

        const session = req.headers.authorization?.split(' ')[1];

        if(!session){
            console.log('no session');
            return res.sendStatus(400);
        }

        const user = await getUserBySessionToken(session);

        if(!user){
            console.log('no user');
            return res.sendStatus(400);
        }

        console.log(new Date(),'user checked');
        return res.status(200).end();
        
    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
}

export const register = async (req: express.Request, res: express.Response) => {
    try{

        const { email, password, username } = req.body;

        if(!email || !password || !username){
            return res.sendStatus(400);
        }

        const existingUser = await getUserByEmail(email);

        if(existingUser){
            return res.sendStatus(400);
        }

        const salt = random();
        
        const user = await createUser(
            username,
            email,
            authentication(salt, password),
            salt, 
            null,
        );

        console.log(new Date(),'user registered');
        return res.status(200).end();
        
    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
}