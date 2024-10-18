import express from 'express'
import { ADDactivity, DeletAllActivity, DeletOneActivity, DeleteFavStation, DeleteTempData, GetAllactivity, GetId,  GetUserInfo,  InsertNewTransaction,  UpdateStatusR,  forgottenpass, getCount, getTempData, getTempDataTwo, updatePassword } from '../controllers/users'; 
import { getAllUsers, deleteUser, updateUser  } from '../controllers/users'
import { isAuthenticated, isOwner } from '../middleware';
import { deleteFav, getData } from '../db/users';
import { fetchNewsApi } from '../scripts/ApiS';


export default ( router: express.Router ) => {
    router.get('/users', isAuthenticated, getAllUsers);
    router.get('/userdata', isAuthenticated,);
    // Session verification
    router.post('/verify', isAuthenticated)
    router.delete('/users/:id', isAuthenticated, isOwner ,deleteUser);
    router.patch('/users/:id', isAuthenticated, isOwner, updateUser);
    router.post('/newpassword/:token',updatePassword)
    router.post('/forgotpass',forgottenpass);
    router.get('/resetpass/:token', GetId);
    // transaction data request operations
    router.get('/getTempData2', getTempDataTwo);
    
    router.post('/updatestatus',UpdateStatusR)
    router.get('/deleteObjects', DeleteTempData)
    router.get('/getcount', getCount)
    
    router.post('/saveTransaction', InsertNewTransaction)
    router.post('/deletFav', DeleteFavStation)
    // NewsApi
    router.get('/newsApi',getTempData)
    // User Activity Routes
    router.post('/logActivty', ADDactivity)
    router.get('/getActivity', GetAllactivity)
    router.post('/deleteOneActivity',DeletOneActivity)
    router.get('/deleteAllActivities',DeletAllActivity)
    

};