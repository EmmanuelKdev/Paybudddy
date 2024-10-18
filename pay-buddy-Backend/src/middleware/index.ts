import express from "express";
import { get, identity, merge } from 'lodash'

import { getUsersSessionToken } from "../db/users";

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { id } = req.params;
        const currentUserId = (get(req, 'identity._id') || '') as string;

        if (!currentUserId){
            return res.status(403);
        }

        if (currentUserId.toString() != id) {
            return res.sendStatus(403)
        }

        next();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const sessionToken = req.cookies['PayBuddy-Auth'];

        if(!sessionToken) {
            return res.sendStatus(403);
        }

        const existinguser = await getUsersSessionToken(sessionToken);

        if (!existinguser) {
            return res.sendStatus(403);
        }

        

        merge(req,  {identity: existinguser});

        res.sendStatus(200);

        return next()


    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}