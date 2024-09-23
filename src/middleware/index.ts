import express from 'express';
import { merge, get } from 'lodash';
import { readJWT } from '../helpers/authHelper';
import { getUserById } from '../db/users';

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try{
        const jwt = req.headers.authorization?.split(' ')[1];

        if(!jwt){
            return res.status(401).json({ error: 'Token mancante' });
        }
        
        let user;
        try {
            user = readJWT(jwt);
            user = get(user, 'user');
        } catch (err) {
            return res.status(401).json({ error: 'Token non valido' });
        }

        if(!user){
            return res.status(401).json({ error: 'Token non valido' });
        }

        merge(req, {identity: user});

        return next();
    } catch (err) {
        console.log(err); 
        return res.sendStatus(400);
    }
}