import express from 'express';
import { merge, get } from 'lodash';

import { getUserBySessionToken } from '../db/users';

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try{
        const sessionToken = req.headers.authorization?.split(' ')[1];

        if(!sessionToken){
            return res.sendStatus(403);
        }

        const user = await getUserBySessionToken(sessionToken);

        if(!user){
            return res.sendStatus(401);
        }

        merge(req, {identity: user});

        return next();
    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
}

export const isOwner = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try{
        const { id } = req.params;
        const currentUserId = get(req, 'identity.id') as string;
        
        if(!currentUserId){
            return res.sendStatus(400);
        }

        if(currentUserId.toString() !== id){
            return res.sendStatus(403);
        }

        next();
    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
}