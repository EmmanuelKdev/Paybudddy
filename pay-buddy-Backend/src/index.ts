import http, { request } from 'http';
import cors from "cors";
import express from "express";
import router from './routes'
import compression from "compression"
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";



import cron from 'node-cron'; // Import cron for scheduling tasks
import { connectuserDb, InsertObjectApi, saveApiData } from './db/users';
import { loadJsonData } from './scripts/localjsondata';



const PORT = process.env.PORT


// Set up the server

export const app = express();

// add Cors

app.use(cors({
    origin:  ['http://localhost:5173', 'https://ssn4g56d-5173.euw.devtunnels.ms', 'http://192.168.197.27:5173/'],
    credentials: true
}));

// add Compression
//Compress outgoing http responses
app.use(compression());

app.use(cookieParser());
app.use(bodyParser.json())




// initialize userDb
  connectuserDb()


 // backup from jsonfile
 const Getdata = async () => {

  await loadJsonData()
  .then((data) =>  InsertObjectApi(data))  // The extracted data is logged here
  .catch((err) => console.error(err));

}
//Getdata()
  
 
 

  // Schedule the `updateNewsData` function to run daily at a specific time (e.g., 2 AM)
//cron.schedule('0 2 * * *', () => {
  //console.log('Running daily news update...');
 // updateNewsData();
//});




// Default port for backend is 3001
// Server start

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} 3000 `);
});

app.use('/',router())
app.use('/logout', (req, res) =>{
  res.clearCookie('PayBuddy-Auth')
  return res.json({status: true})
})