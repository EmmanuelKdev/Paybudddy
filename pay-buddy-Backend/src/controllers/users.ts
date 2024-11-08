import express from 'express';
import { deleteUserById, getUserbyId, getUsers, getUserbyEmail, getUsersSessionToken, getData, deletObjects, countDocs, deleteFav, updateStatus, addItemToRecord, getAllItemsFromRecord, deleteItemFromRecord, deleteAllItemsFromRecord, getUserData} from '../db/users';
import nodemailer from 'nodemailer'
import { random, authentication, decryption } from '../helpers'; 
import crypto from 'crypto';
import jwt from 'jsonwebtoken';




const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'snowbytetdev@gmail.com',
      pass: 'gshf silm cvbf orbb',
    },
  });



export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
         
        const users = await getUsers();

        return res.status(200).json(users)

    } catch (error) {
        console.log(error);
        return res.sendStatus(400)
    }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
   try {
    const { id } = req.params;

    const deletedUser = await deleteUserById(id);

    return res.json(deletedUser);




   } catch (error) {
    console.log(error);
    return res.sendStatus(400);
   }
}

export const GetUserInfo = async (req: express.Request, res: express.Response) => {
  try {
   const { id } = req.params;

   const User = await getUserbyId(id);

   return res.json(User)




  } catch (error) {
   console.log(error);
   return res.sendStatus(400);
  }
}

export const updateUser = async (req: express.Request, res: express.Response) => {
   try {
    const { id } = req.params;

    const { name } = req.body;

    if (!name) {
        return res.sendStatus(400);
    }

    const user = await getUserbyId(id);
    if (!user) {
      return res.sendStatus(404);
   }

    user.name = name;
    await user.save();

    return res.status(200).json(user).end();


   } catch (error) {
    console.log(error);
    return res.sendStatus(400);
   }
}

export const updatePassword = async (req: express.Request, res: express.Response) => {
   


    const salt = random();
    
    try {

      const { token }  = req.params;
 
      const { password } = req.body;
      const key = 'Pay!Buddy234'
      const user =  await getUsersSessionToken(token).select('+authentication.salt +authentication.password');
      if(!user){
        return res.sendStatus(404)
      }

      if (!user.authentication) {
        return res.status(400).send("User authentication information is missing.");
     }
      
      
      
      user.authentication.password = authentication(salt,password)

      

      await user.save();

      return res.status(200).json(user).end();
       
      
 
    } catch (error) {
     console.log("failed to update password");
     return res.sendStatus(400);
    }
 }

 export const GetId = async (req: express.Request, res: express.Response) =>{
  
    const token = req.cookies['PayBuddy-Auth'];
    
    const user =  await getUsersSessionToken(token)
    
    if(!user){

      return res.sendStatus(404);
      
      
    } else{
      return res.status(200).json(user);
    }
    
    

 }



export const forgottenpass = async (req: express.Request, res: express.Response) =>{

  try{
    const { email } = req.body
    const user = await getUserbyEmail(email)
    if (!user) {
      return res.sendStatus(404);
    }
    if (!user.authentication) {
      return res.status(400).send("User authentication information is missing.");
  }

    const salt = random();
    user.authentication.sessionToken = authentication(salt, user._id.toString());
    const token = user.authentication.sessionToken
    await user.save()

    if(email != user.email){
       
      console.log("User Email does not exit")
        
      return res.sendStatus(403)
    }
    try {
      // Send email
      await transporter.sendMail({
        from: 'snowbytetdev@gmail.com',
        to: email,
        subject: 'Reset Password',
        // should be VM ip address here
        text: `http://localhost:5173/resetpass/${token}`
      });
      return res.sendStatus(200)
    } catch (error) {
      return res.status(500);
    }

    

  } catch (error) {
    console.log("faile to send email");
    return res.sendStatus(400);
   }


    

   
}
// Tranaction data Operations

export const getTempData = async (req: express.Request, res: express.Response) => {
  try {
      const token = req.cookies['PayBuddy-Auth'];
    
      const user =  await getUsersSessionToken(token)
      if(!user){
        return res.sendStatus(400)
      }
      const news = await getData()
      

      return res.status(200).json(news)

  } catch (error) {
      console.log(error);
      return res.sendStatus(400)
  }
}
export const getTempDataTwo = async (req: express.Request, res: express.Response) => {
  try {
      const token = req.cookies['PayBuddy-Auth'];
    
      const user =  await getUsersSessionToken(token)
      if(!user){
        return res.sendStatus(400)
      }
     
      

      return res.status(200).json(user)

  } catch (error) {
      console.log(error);
      return res.sendStatus(400)
  }
}

export const UpdateStatusR = async (req: express.Request, res: express.Response) =>{
  try{
    const token = req.cookies['PayBuddy-Auth'];
    const {Newstatus,Tid} = req.body
    console.log(Newstatus)
    console.log(Tid)
    
    
    const user =  await getUsersSessionToken(token)
    if(!user){
      res.sendStatus(400)

    }
    const update = await updateStatus(Newstatus,Tid)
    if(!update){

      console.log('error verifying update')

    }
    return res.status(200).json(user)



  } catch (error) {
    console.error("Error updating status:", error);
    return res.status(500).json({ message: "Server error" })
  }
}
export const DeleteTempData = async (req: express.Request, res: express.Response) => {
  try {
       
      const users = await deletObjects();

      return res.status(200).json(users)

  } catch (error) {
      console.log(error);
      return res.sendStatus(400)
  }
}

export const getCount = async (req: express.Request, res: express.Response) => {
  
  try {
       
      const count = await countDocs();

      return res.status(200).json(count)

  } catch (error) {
      console.log(error);
      return res.sendStatus(400)
  }
}
// favorite stations

export const InsertNewTransaction = async (req: express.Request, res: express.Response) => {

  const existingCodes = new Set<string>();
  
  try {
    // Code generator
    const generateUniqueCode = () => {
      const code = Date.now();
      return code;
     
    };


    const  {Tdata} = req.body
    const token = req.cookies['PayBuddy-Auth'];
    const user:any =  await getUsersSessionToken(token)
    const code = generateUniqueCode();
    if(!user){
      res.sendStatus(400)
    }
    const NewData = {T_id:code,Tname:Tdata.title,Tpayername:Tdata.payerName,Temail:Tdata.email,Tamount:Tdata.amountToBePaid,Tdescription:Tdata.description,status:'Pending', Timedate: Date.now()}
    user.userItems.savedItems.push(NewData)
    await user.save();
    return res.sendStatus(200)

  } catch (error) {
      console.log(error);
      return res.sendStatus(400)
  }
}

export const DeleteFavStation = async (req: express.Request, res: express.Response) => {
  try {
    const { Tid } = req.body;
   
    const token = req.cookies['PayBuddy-Auth'];
    const user = await getUsersSessionToken(token);
    
    if (!user) {
      return res.sendStatus(400); // User not found, send 400 Bad Request
    }
    await deleteFav(Tid)


    return res.status(200).json(user.userItems);

    
  } catch (error) {
    console.error(error);
    return res.sendStatus(500); // Internal Server Error
  }
}
// User Activity Functions

export const ADDactivity = async (req: express.Request, res: express.Response) => {
  try {
    const {activityWatcher, currentTimestamp} = req.body;
   
    const token = req.cookies['PayBuddy-Auth'];
    const user = await getUsersSessionToken(token);
    
    if (!user) {
      return res.sendStatus(400); // User not found, send 400 Bad Request
    }
    const data: any = { msg:activityWatcher, timestamp: currentTimestamp}
    await addItemToRecord(user._id,data)


    return res.status(200);

    
  } catch (error) {
    console.error(error);
    return res.sendStatus(500); // Internal Server Error
  }
}

export const GetAllactivity = async (req: express.Request, res: express.Response) => {
  try {
    
   
    const token = req.cookies['PayBuddy-Auth'];
    const user = await getUsersSessionToken(token);
    
    if (!user) {
      return res.sendStatus(400); // User not found, send 400 Bad Request
    }
    
    await getAllItemsFromRecord(user._id)


    return res.status(200).json(user.activity);

    
  } catch (error) {
    console.error(error);
    return res.sendStatus(500); // Internal Server Error
  }
}

export const DeletOneActivity = async (req: express.Request, res: express.Response) => {
  try {

    const { Tid } = req.body;
    
   
    const token = req.cookies['PayBuddy-Auth'];
    const user = await getUsersSessionToken(token);
    
    if (!user) {
      return res.sendStatus(400); // User not found, send 400 Bad Request
    }
    
    await deleteItemFromRecord(Tid) 


    return res.sendStatus(200);

    
  } catch (error) {
    console.error(error);
    return res.sendStatus(500); // Internal Server Error
  }
}

export const DeletAllActivity = async (req: express.Request, res: express.Response) => {
  try {
    const token = req.cookies['PayBuddy-Auth'];
    const user = await getUsersSessionToken(token);
    
    if (!user) {
      return res.sendStatus(400); // User not found, send 400 Bad Request
    }
    
    await deleteAllItemsFromRecord(user._id);

    return res.sendStatus(200); // Send 200 OK status after successful deletion

  } catch (error) {
    console.error(error);
    return res.sendStatus(500); // Internal Server Error
  }
}

