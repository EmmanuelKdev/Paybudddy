import {  updateDatabase } from "./mongodb"; // Import functions to save/update data in MongoDB
import https from 'https'; // Use ES6 import for https module
import dotenv from 'dotenv';
import Redis from 'ioredis'; // Redis client library for Node.js
import { Request, Response } from 'express'; // Import Request and Response types from express
import { GetApiData, saveApiData } from "../db/users";
import { loadJsonData } from "./localjsondata";

dotenv.config(); // Load environment variables

// Initialize Redis client
const redisClient = new Redis({
  port: parseInt(process.env.REDIS_PORT || '6379', 10), // Default to 6379 if REDIS_PORT is not set
  host: process.env.REDIS_HOST || '127.0.0.1' // Default to 127.0.0.1 if REDIS_HOST is not set
});

// MongoDB collection
const apiCollectionName = process.env.API_DATA_COLLECTION as string;

// Function to fetch data from Redis cache
async function getFromCache(key: string): Promise<any | null> {
  const cachedData = await redisClient.get(key);
  return cachedData ? JSON.parse(cachedData) : null;
}

// Function to save data to Redis cache
async function saveToCache(key: string, data: any, ttl: number = 3600): Promise<void> {
  await redisClient.set(key, JSON.stringify(data), 'EX', ttl); // Cache for 1 hour by default
}

// Function to fetch and serve API data
export async function fetchNewsApi(req: Request, res: Response): Promise<void> {
  const cacheKey = 'news:business'; // Redis key for the cached news data

  try {
    // Check if data is already cached in Redis
    const cachedData = await getFromCache(cacheKey);
    if (cachedData) {
      console.log('Serving data from Redis cache:', cachedData);
      res.json(cachedData);
      return;
    }

    // Check if data is available in MongoDB
    

   

    const dbData = await GetApiData();

    if (dbData) {
      console.log('Serving data from MongoDB:', dbData);
      await saveToCache(cacheKey, dbData); // Cache data in Redis for future requests
      res.json(dbData);
      return;
    } 
    

    
      
      
      
    

    

    // Data is not in Redis or MongoDB, API call would be here (commented out)
    /*
    const chunks: any[] = []; // Collect chunks here

    const apiKey = process.env.RAPIDAPI_KEY;
    const apiHost = 'google-news13.p.rapidapi.com';

    if (!apiKey) {
      throw new Error('Missing RapidAPI key in environment variables.');
    }

    const options = {
      method: 'GET',
      hostname: apiHost,
      path: '/business?lr=en-US',
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': apiHost
      }
    };

    const apiRequest = https.request(options, (apiRes) => { // Changed variable name to avoid conflicts
      apiRes.on('data', (chunk: any) => {
        chunks.push(chunk);
      });

      apiRes.on('end', async () => {
        try {
          const body = Buffer.concat(chunks).toString();
          const parsedData = JSON.parse(body); // Ensure proper type handling

          console.log(parsedData);

          // Save the data to MongoDB
          await saveApiData(parsedData);
          console.log('Data saved successfully to MongoDB.');

          // Save the data to Redis cache
          await saveToCache(cacheKey, parsedData);

          // Send the fetched data to the client
          res.json(parsedData);

        } catch (error) {
          console.error('Error parsing response:', error);
          res.status(500).send('Error processing request');
        }
      });
    });

    apiRequest.on('error', (error) => {
      console.error('Error with HTTP request:', error);
      res.status(500).send('Error fetching data from API');
    });

    apiRequest.end();
    */

    // Send a message if no data is found
    res.status(404).send('Data not found in cache or database');

  } catch (error) {
    console.error('Error handling news API request:', error);
    res.status(500).send('Internal server error');
  }
}

// The function to fetch and update news data
/*export async function updateNewsData(): Promise<void> {
  try {
    const cacheKey = 'news:business'; // Redis key for the cached news data
    const chunks: any[] = []; // Collect chunks of data here

    const apiKey = process.env.RAPIDAPI_KEY;
    const apiHost = 'google-news13.p.rapidapi.com';

    if (!apiKey) {
      throw new Error('Missing RapidAPI key in environment variables.');
    }

    const options = {
      method: 'GET',
      hostname: apiHost,
      path: '/business?lr=en-US',
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': apiHost
      }
    };

    const apiRequest = https.request(options, (res) => {
      res.on('data', (chunk: any) => {
        chunks.push(chunk);
      });

      res.on('end', async () => {
        try {
          const body = Buffer.concat(chunks).toString();
          const parsedData = JSON.parse(body);

          // Update the database with the fetched data
          await updateDatabase(parsedData);

          // Update Redis cache with new data
          await saveToCache(cacheKey, parsedData);
        } catch (error) {
          console.error('Error parsing response:', error);
        } 
      });
    });

    apiRequest.on('error', (error) => {
      console.error('Error with HTTP request:', error);
    });

    apiRequest.end();
  } catch (error) {
    console.error('Error making news API request:', error);
  }
}*/
