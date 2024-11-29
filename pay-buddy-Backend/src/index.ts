import http, { request } from 'http';
import cors from "cors";
import express, { Application } from "express";

import compression from "compression"
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { createApolloServer } from './graphQl/indexQl';

import cron from 'node-cron'; // Import cron for scheduling tasks
import { connectuserDb, InsertObjectApi, saveApiData } from './db/users';
import { loadJsonData } from './scripts/localjsondata';



// port
const PORT = process.env.PORT


// Set up the server

const app: Application = express();

// add Cors
const allowedOrigins = [
  'http://localhost:5173',
  'https://ssn4g56d-5173.euw.devtunnels.ms',
  'http://192.168.197.27:5173'
];

app.use(cors({
  origin: (origin: any, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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


// Start the Apollo Server
createApolloServer(app)
  
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

function graphqlExpress(arg0: (_: any, res: any) => void): import("express-serve-static-core").RequestHandler<{}, any, any, import("qs").ParsedQs, Record<string, any>> {
  throw new Error('Function not implemented.');
}

