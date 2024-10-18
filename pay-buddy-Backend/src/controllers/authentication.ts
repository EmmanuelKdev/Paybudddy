import express from 'express';

import { getUserbyEmail, createUser, getUsersSessionToken } from '../db/users';
import { random, authentication } from '../helpers'; 
import dotenv from 'dotenv';
import { Response } from 'express';
import { NONAME } from 'dns';

dotenv.config();






// Login Functionality

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.sendStatus(400)
        }

        const user = await getUserbyEmail(email).select('+authentication.salt +authentication.password');

        if (!user) {
            return res.sendStatus(400);
        }
        if (!user.authentication?.salt) {
            return res.status(400).send("User authentication information is missing.");
        }

        const expectedhash = authentication(user.authentication.salt, password);

        if (user.authentication.password != expectedhash) {
            return res.sendStatus(403);
        }

        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();

        // Sends the cookie to clients browser

        const isProduction = process.env.NODE_ENV === 'production'

        res.cookie('PayBuddy-Auth', user.authentication.sessionToken, { 
            // toggles between production and developement based on env variable
            domain: isProduction ? `.${process.env.DOMAIN}` : 'localhost',
            path: '/',
            maxAge: 24*60*60*1000,
            httpOnly: true,
            //for production this should be enabled
            secure: true,
            sameSite: "none",
           
        });

        res.status(200).json(user).end();


    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }

}

export const register = async(req: express.Request, res: express.Response) => {
    try{
        const {name, email, password} = req.body;

        if (!email || !password || !name){
            return res.sendStatus(400);
        }

        const existinguser = await getUserbyEmail(email)

        if (existinguser) {
            return res.sendStatus(400);
        }

        const salt = random();
        const user = await createUser({
            email,
            name,
            authentication: {
                salt,
                password: authentication(salt, password),
            },
        });

        return res.status(200).json(user).end();

    } catch (error) {
        console.log('Void data or no data')
        return res.sendStatus(400)
    }
}

