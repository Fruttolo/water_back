import express from 'express';
import { getUserByEmail, createUser, updateUserById, getUserBySessionToken, getUserByUsername, getUserById} from '../db/users';
import { random , authentication} from '../helpers';
import { hashPassword, createJWT, readJWT } from '../helpers/authHelper';
import { create, get } from 'lodash';

export const login = async (req: express.Request, res: express.Response) => {
    try{

        const { username, password } = req.body;

        if(!username || !password){
            return res.status(400).json({ error: 'Username o password mancante' });
        }

        const user = await getUserByUsername(username);

        if(!user){
            return res.status(400).json({ error: 'Username non esistente' });
        }

        const hashedPassword = hashPassword(password);
        
        if( hashedPassword !== user.password){
            return res.status(403).json({ error: 'Password errata' });
        }

        const access_token = createJWT(user, '1h');
        const refresh_token = createJWT(user.id, '7d');

        console.log(user.username,'user logged in');
        return res.status(200).json({ access_token, refresh_token });
        
    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
}

export const register = async (req: express.Request, res: express.Response) => {
    try{

        const { password, username } = req.body;

        if(!password || !username){
            return res.status(400).json({ error: 'Username o password mancante' });
        }

        const existingUser = await getUserByUsername(username);

        if(existingUser){
            return res.status(400).json({ error: 'Username già esistente' });
        }

        const hashedPassword = hashPassword(password);
        
        const user = await createUser(
            username,
            "email",
            hashedPassword,
            "salt",	 
            null,
        );

        const newUser = await getUserById(user.lastID);

        const access_token = createJWT(newUser, '1h');
        const refresh_token = createJWT(newUser.id, '7d');

        console.log(username,'user registered');
        return res.status(200).json({ access_token, refresh_token });
        
    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
}

export const refresh = async (req: express.Request, res: express.Response) => {
    try{

        const { refresh_token } = req.body;

        if(!refresh_token){
            return res.status(400).json({ error: 'Refresh token mancante' });
        }

        let user_id;
        try {
            user_id = readJWT(refresh_token);
            user_id = get(user_id, 'user');
        } catch (err) {
            return res.status(400).json({ error: 'Refresh token non valido' });
        }

        if(!user_id){
            return res.status(400).json({ error: 'Refresh token non valido' });
        }

        const user = await getUserById(user_id);

        if(!user){
            return res.status(400).json({ error: 'Utente non esistente' });
        }

        const access_token = createJWT(user, '1h');
        const new_refresh_token = createJWT(user_id, '7d');

        console.log(user.username,'user refreshed');
        return res.status(200).json({ access_token, new_refresh_token });
        
    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
}

export const check = async (req: express.Request, res: express.Response) => {
    try{

        return res.status(200).json({ message: 'Utente autenticato' });
        
    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
}