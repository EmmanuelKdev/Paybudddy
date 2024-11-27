import { getUserByToken, getVcode, UserModel } from "../db/users";
import { register, login } from "../controllers/authentication";

import { getUserbyEmail, createUser, deleteUserById, getUserbyId, getUsers, getUsersSessionToken, getData, deletObjects, countDocs, deleteFav, updateStatus, addItemToRecord, getAllItemsFromRecord, deleteItemFromRecord, deleteAllItemsFromRecord, getUserData } from "../db/users";
import { setCookie } from "../helpers/cookies";
import { random, decryption, authentication } from "../helpers/index";
import nodemailer from 'nodemailer';
import { Transaction } from "mongodb";


const emailpass = process.env.EMAIL_PASSWORD;
const emailHost = process.env.EMAIL_HOST;
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: emailHost,
    pass: emailpass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const resolvers = {
  // Query resolvers
  Query: {
    getUser: async (_: any, { email }: { email: string }) => {
      return await UserModel.findOne({ email }).select('+authentication.password +authentication.salt +authentication.sessionToken');
    },
   
    getUserById: async (_: any, { id }: { id: string }) => {
      try {
        return await getUserbyId(id);
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch user');
      }
    },
    getUserByEmail: async (_: any, { email }: { email: string }) => {
      try {
        return await getUserbyEmail(email);
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch user');
      }
    },

    getUserBySessionToken: async (_: any, __: any, { req }: { req: any }) => {
      const sessionToken = req.cookies['PayBuddy-Auth'];
      if (!sessionToken) {
        throw new Error('No session token provided');
      }
      const user = await getUsersSessionToken(sessionToken);
      if (!user) {
        throw new Error('Invalid session token');
      }
      
      return user;
    },
   
   
   
    getTempDataTwo: async (_: any, __: any, { req }: { req: any }) => {
      const sessionToken = req.cookies['PayBuddy-Auth'];
      if (!sessionToken) {
        throw new Error('No session token provided');
      }
      const user = await getUsersSessionToken(sessionToken);
      
      if (!user) {
        throw new Error('Invalid session token');
      }
      console.log('User items:', user.Transaction?.items);
      console.log('User items:', user.Transaction?.items);
      const data = user.Transaction;
      return data || [];
    },

    getCount: async (_: any, __: any, { req }: { req: any }) => {
      try {
         const sessionToken = req.cookies['PayBuddy-Auth'];
         if (!sessionToken) {
          throw new Error('No session token provided');
         }
         const user = await getUsersSessionToken(sessionToken);
         if (!user) {
          throw new Error('Invalid session token');
        }
         const count = await countDocs(user.email);
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch count');
      }
    },
    getAllActivity: async (_: any, __: any, { req }: {  req: any }) => {
      const sessionToken = req.cookies['PayBuddy-Auth'];
      try {
        if (!sessionToken) throw new Error('Not authenticated');
        const user = await getUsersSessionToken(sessionToken);
        if (!user) throw new Error('User not found');
        // Return the activity records
        const activities = await getAllItemsFromRecord(user._id);
        console.log( activities);
        return activities || [];
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch activity');
      }
    },
  },
  Mutation: {
    register: async (_: any, { name, email, password }: { name: string, email: string, password: string }) => {
      if (!email || !password || !name) {
        throw new Error('Missing required fields');
      }

      const existingUser = await getUserbyEmail(email);

      if (existingUser) {
        throw new Error('User already exists');
      }

      const salt = random();
      const hashedPassword = authentication(salt,password); // Hash the password with a salt round of 10

      const user = await createUser({
        email,
        name,
        authentication: {
          salt,
          password: hashedPassword,
        },
      });

      return user;
    },
    login: async (_: any, { email, password }: { email: string, password: string }, { res }: { res: any }) => {
      if (!email || !password) {
        throw new Error('Missing required fields');
      }

      const user = await getUserbyEmail(email).select('+authentication.salt +authentication.password');

      if (!user) {
        throw new Error('User not found');
      }
      if (!user.authentication?.salt) {
        throw new Error('User authentication information is missing');
      }

      const givenPassword = authentication(user.authentication.salt, password);
      const hashedPassword = user.authentication.password;
      if(givenPassword !== hashedPassword){
          throw new Error('Invalid Credentials');
      }

      const salt = random();
      user.authentication.sessionToken = authentication(salt, user._id.toString());

      await user.save();

      // Set the cookie
      setCookie(res, user.authentication.sessionToken);
     
         

      // Return the session token
      return user.authentication.sessionToken;
    },
    logout: async (_: any, __: any, { res }: { res: any }) => {
      res.clearCookie('PayBuddy-Auth');
      return true;
    },
    deleteUser: async (_: any, { id }: { id: string }) => {
      try {
        return await deleteUserById(id);
      } catch (error) {
        console.error(error);
        throw new Error('Failed to delete user');
      }
    },
    updateUser: async (_: any, { id, name }: { id: string, name: string }) => {
      try {
        const user = await getUserbyId(id);
        if (!user) throw new Error('User not found');
        user.name = name;
        await user.save();
        return user;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to update user');
      }
    },
    updatePassword: async (_: any, { token, password }: { token: any, password: string }) => {
      try {
       
        console.log('Token for pasUpdate:', token);
        const user = await getUsersSessionToken(token).select('+authentication.salt +authentication.password');
        if (!user) throw new Error('User not found');
        if (!user.authentication) throw new Error('User authentication information is missing');
        const salt = random();
        user.authentication.password = authentication(salt, password);
        await user.save();
        return user;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to update password');
      }
    },
    forgottenPass: async (_: any, { email }: { email: string }) => {
      try {
        console.log('resting password')
        const user = await getUserbyEmail(email);
        if (!user) throw new Error('User not found');
        if (!user.authentication) throw new Error('User authentication information is missing');
        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());
        const token = user.authentication.sessionToken;
        await user.save();
        await transporter.sendMail({
          from: 'snowbytetdev@gmail.com',
          to: email,
          subject: 'Reset Password',
          text: `http://localhost:5173/newpass/${token}`
        });
        return true;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to send reset password email');
      }
    },
    updateStatusR: async (_: any, { newStatus, tid }: { newStatus: string, tid: any }, { user }: { user: any }) => {
      try {
        if (!user) throw new Error('Not authenticated');
        await updateStatus(newStatus, tid, user._id);
        return user;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to update status');
      }
    },
    deleteTempData: async () => {
      try {
        await deletObjects();
        return true;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to delete temp data');
      }
    },
    insertNewTransaction: async (_: any, { tdata }: { tdata: any }, { req }: { req: any }) => {
      try {
        const sessionToken = req.cookies['PayBuddy-Auth'];
        if (!sessionToken) {
          throw new Error('No session token provided');
        }
        const user = await getUsersSessionToken(sessionToken);
        if (!user) {
          throw new Error('User not found');
        }
        const verificationCode = () => {
          const min = 1000;
          const max = 9999;
          const code = Math.floor(Math.random() * (max - min + 1)) + min;
          return code.toString();
        }
        const code = Date.now().toString();
        const newData = {
          T_id: code,
          Tname: tdata.title,
          Tpayername: tdata.payerName,
          Temail: tdata.email,
          Tamount: tdata.amountToBePaid,
          Tdescription: tdata.description,
          status: 'Pending',
          Timedate: Date.now().toString(),
          verificationCode: verificationCode(),
        };
        user.Transaction?.items.push(newData);
        await user.save();
        return true;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to insert new transaction');
      }
    },
    deleteTransactation: async (_: any, { tid }: { tid: any }, { req }: { req: any }) => {
      try {
        const sessionToken = req.cookies['PayBuddy-Auth'];
        if (!sessionToken) {
          throw new Error('No session token provided');
        }
        const user = await getUsersSessionToken(sessionToken);
        if (!user) {
          throw new Error('User not found');
        }
        console.log('attempting to delete');
        console.log('Tid:', tid);
        const result = await deleteFav(user._id, tid);
        return result.success;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to delete favorite station');
      }
    },
    sendverificationCode: async (_: any, { tid }: { tid: any }, { req }: { req: any }) => {
      try {
        const sessionToken = req.cookies['PayBuddy-Auth'];
        if (!sessionToken) {
          throw new Error('No session token provided');
        }
        const user = await getUsersSessionToken(sessionToken);
        if (!user) {
          throw new Error('User not found');
        }
        // Get the client data specifcaly the email and  verification code
        const ClientData = await getVcode(user._id, tid)
        const email = ClientData.payerEmail;
        const code = ClientData.code;
        await transporter.sendMail({
          from: 'snowbytetdev@gmail.com',
          to: email,
          subject: 'Completion Code',
          text: `Here is your completion code: ---> ${code}. n/b: Do not share this code with anyone
           n/b: Click on the link below to complete Transaction ---> http://localhost:5173/usercodeentry/${tid}
          `,
          
        });
        return true;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to send verification code');
      }
        
    },

    sendVerificationCode_Client: async (_: any, { token, tid, status }: { token: any,tid: any, status: string }) => {
      try {
        const user = await getUserByToken(token);

        if (!user) throw new Error('User not found');

        //console.log('User:', user.Transaction?.items);

        const ClientData = await getVcode(user._id, token);
        //console.log('ClientData:', ClientData);
        if(ClientData.code !== tid.toString()) throw new Error('Invalid code');

        await updateStatus(status, token, user._id);
        return true;

      } catch (error) {
        console.error(error);
        throw new Error('Failed to verfiy code');
      }
    },


    addActivity: async (_: any, { activityWatcher, currentTimestamp }: { activityWatcher: string, currentTimestamp: any }, { req }: { req: any }) => {
      try {
        const sessionToken = req.cookies['PayBuddy-Auth'];
        if (!sessionToken) {
          throw new Error('No session token provided');
        }
        const user = await getUsersSessionToken(sessionToken);
        if (!user) {
          throw new Error('User not found');
        }
        const data = { msg: activityWatcher, id: currentTimestamp };
        await addItemToRecord(user._id, data);
        return true;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to add activity');
      }
    },
    deleteOneActivity: async (_: any, { tid }: { tid: any}, { req }: { req: any }) => {
      try {
        
        const sessionToken = req.cookies['PayBuddy-Auth'];
        if (!sessionToken) {
          throw new Error('No session token provided');
        }
        const user = await getUsersSessionToken(sessionToken);
        if (!user) {
          throw new Error('User not found');
        }
        await deleteItemFromRecord(tid);
        return true;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to delete activity');
      }
    },
    deleteAllActivity: async (_: any, __: any, { req }: { req: any }) => {
      try {
        const sessionToken = req.cookies['PayBuddy-Auth'];
        if (!sessionToken) {
          throw new Error('No session token provided');
        }
        const user = await getUsersSessionToken(sessionToken);
        if (!user) {
          throw new Error('User not found');
        }
        await deleteAllItemsFromRecord(user._id);
        return true;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to delete all activities');
      }
    },
  },
};

export { resolvers };