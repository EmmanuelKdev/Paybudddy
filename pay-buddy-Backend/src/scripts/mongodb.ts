import mongoose from 'mongoose';
import * as mongoDB from "mongodb";
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

// Ensure environment variables are defined
const conn_string = process.env.DB_CONN_STRING as string;
const connect_stringUser = process.env.USER_DB_STRING as string;
const collectionName = process.env.USERS_COLLECTION as string;
const apiCollectionName = process.env.API_DATA_COLLECTION as string;
const databaseName = process.env.USER_DB as string;

// MongoDB connection options
const optionTimeout = {
  connectTimeoutMS: 30000, // Set connection timeout to 30 seconds
  socketTimeoutMS: 30000,  // Set socket timeout to 30 seconds
};

// MongoDB client
const client = new mongoDB.MongoClient(conn_string, optionTimeout);

// Object to hold MongoDB collections
export const collections: { paybuddy?: mongoDB.Collection, subscriber?: mongoDB.Collection, apiData?: mongoDB.Collection } = {};











// Function to update the database with the fetched news data
export async function updateDatabase(data: any): Promise<void> {
  try {
    // If data is void
    if (!data) {
      throw new Error('Data Seems void');
    }

    // Connect to MongoDB and get the collection
    const client = await mongoDB.MongoClient.connect(conn_string, optionTimeout);
    const db = client.db(databaseName);
    const collection = db.collection(apiCollectionName);

    const getCollectionlength =  async () => {
      const count = await collection.countDocuments();
    }
    const docCoount = collection.countDocuments()

    for (const item of data) {
      // Check for the existence of the article based on a unique identifier (e.g., article ID)
      const existingItem = await collection.findOne({ id: item.id });

      if (existingItem) {
        // Update existing item if necessary
        await collection.updateOne({ id: item.id }, { $set: item });
      } else {
        // Insert new item
        await collection.insertOne(item);
      }
    }
    

    console.log('Database updated successfully with new news data.');
  } catch (error) {
    console.error('Failed to update database:', error); // Handle database errors
  }
}



