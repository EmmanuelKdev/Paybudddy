import { Response, Request } from 'express';
import { getUsersSessionToken } from '../db/users';

export const setCookie = (res: Response, token: string) => {
  console.log('Setting cookie');
 // This is the cookie that will be set in the browser *Working!
  res.cookie('PayBuddy-Auth', token, {
    domain: 'localhost',
    path: '/',
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
  });
};

export const verifySessionToken = async (token: any) => {
    const sessionToken = token;
  
    if (!sessionToken) {
      throw new Error('No session token provided');
    }
  
    const existingUser = await getUsersSessionToken(sessionToken);
    console.log('Existing User:', existingUser);
  
    if (!existingUser) {
      throw new Error('Invalid session token');
    }
  
    return existingUser;
  };