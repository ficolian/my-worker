import express from 'express';

import {get, identity, merge} from 'lodash';

import { getUserByJwtToken } from '../db/user';

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> => {
    try {
        const sessionToken = req.cookies['TRAVLR-AUTH'];

        if (!sessionToken) {
            return res.status(403).json({message:'user is unauthorize'});
        }

        const existingUser = await getUserByJwtToken(sessionToken);

        if (!existingUser) {
            return res.status(403).json({ message:'user is unauthorize' });
        }

        merge(req, {identity: existingUser});

        return next();
        
    } catch (error) {
        console.log(error);
        return res.sendStatus(400)
    }
}