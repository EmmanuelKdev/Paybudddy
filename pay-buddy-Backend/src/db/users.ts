import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const conn_string = process.env.DB_CONN_STRING as string;
const connect_stringUser = process.env.USER_DB_STRING as string;
const userCollectionName = process.env.USERS_COLLECTION as string;
const dataCollectionName = process.env.API_DATA_COLLECTION as string;
const databaseName = process.env.USER_DB as string;


const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email:{type: String, required: true},
   
    authentication: {
        password: {type: String, required: true, select: false},
        salt:{type: String, select: false},
        sessionToken: {type: String, select: false},
    },
    userItems: {
        savedItems:[{type:Object}]
    },
    Transaction: {
        items:[{type:Object}]
    },
    activity: {
        record:[{type:Object}]
    }
})

const DataSchema = new mongoose.Schema({
    apiData: {type: Object, required: false}
})

// MongoDB connection options
const optionTimeout = {
  connectTimeoutMS: 30000, // Set connection timeout to 30 seconds
  socketTimeoutMS: 30000,  // Set socket timeout to 30 seconds
};

export const UserModel = mongoose.model('subscribers', UserSchema);
export const DataModell = mongoose.model('tempdatas' , DataSchema)



// Initialize DataBase

export async function connectuserDb(): Promise<void> {
  try {
    // Connect to MongoDB using Mongoose
    await mongoose.connect(conn_string, optionTimeout);
    console.log(`[****Mongoose****] - Successfully connected to database: ${databaseName}`);

    // Create or retrieve the models for the collections
    const UserModel = mongoose.models[userCollectionName] || mongoose.model(userCollectionName, UserSchema);
    const DataModell = mongoose.models[dataCollectionName] || mongoose.model(dataCollectionName, DataSchema);

    // Get the current database connection from Mongoose
    const db = mongoose.connection.db;

    // Check if the 'subscribers' collection exists
    const collectionsList = await db.listCollections({ name: 'subscribers' }).toArray();

    if (collectionsList.length === 0) {
      // Create the 'subscribers' collection if it doesn't exist
      await db.createCollection('subscribers');
      console.log('Collection "subscribers" created successfully.');
    } else {
      console.log('Collection "subscribers" already exists.');
    }

    // Check and create the index for the `email` field in User collection if not present
    const existingIndexes = await UserModel.collection.indexes();
    const hasEmailIndex = existingIndexes.some(index => index.name === 'email_1');

    if (!hasEmailIndex) {
      await UserModel.collection.createIndex(
        { email: 1 },
        { name: 'email_1', unique: true }
      );
      console.log('Index on `email` created successfully.');
    } else {
      console.log('Index on `email` already exists.');
    }

    // Log success
    console.log(`[****Mongoose****] - Successfully connected to database: ${databaseName}, User collection: ${UserModel.collection.collectionName}, Data collection: ${DataModell.collection.collectionName}.`);

  } catch (error) {
    console.error('Database connection failed:', error);
    gracefulShutdown(1); // Use graceful shutdown with error code
  }
}

// Graceful shutdown handler
async function gracefulShutdown(exitCode: number): Promise<void> {
  console.log('Gracefully shutting down...');

  try {
    // Close Mongoose connection
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('Mongoose connection closed.');
    }

    console.log('Shutdown complete.');
    process.exit(exitCode); // Exit the process with the provided exit code
  } catch (err) {
    console.error('Error during graceful shutdown:', err);
    process.exit(1); // Exit with error code if shutdown fails
  }
}

// Database Operations

//export const saveInToApiData = (values: Record<string, any>) => new DataModell(values).save().then((user) => user.toObject());

export async function saveApiData(data: object[]): Promise<void> {
  try {
    if (!DataModell.collection) {
      throw new Error("API Data Model is not initialized.");
    }

    // Create a new document using the Mongoose model and save it to the database
    const inputData = await new DataModell(data).save().then((user) => user.toObject());
   //const apiDataDocument = new dataModel.apiData(data);
    //const result = await apiDataDocument.save();  // This will save the document using Mongoose

    console.log(`Data successfully saved to API collection.`);
  } catch (error) {
    console.error("Failed to save API data:", error);
  }
}
export const GetApiData = () => DataModell.find();

//



export const getUsers = () => UserModel.find();
export const getUserbyEmail = (email: string) => UserModel.findOne({email});
export const getUsersSessionToken = (sessionToken: string) => UserModel.findOne({
    'authentication.sessionToken': sessionToken,
});
export const getUserbyId = (id: string) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) => new UserModel(values).save().then((user) => user.toObject());
  
export const deleteUserById = (id: string) => UserModel.findOneAndDelete({_id: id});
export const updateUserByID =  (id: string, values: Record<string,any>) => UserModel.findByIdAndUpdate(id, values)


export const getUserData = async () => {
  try {
      const result = await UserModel.find();
      return result;
  } catch (error) {
      console.error('Error:', error);
      throw error; // Re-throwing the error for the caller to handle
  }
}


// temp data operations

export const getData = async () => {
    try {
        const result = await DataModell.find();
        return result;
    } catch (error) {
        console.error('Error:', error);
        throw error; // Re-throwing the error for the caller to handle
    }
}
export const InsertObjectApi = async (data: object) => {
    const newData = new DataModell({apiData: data});
    await newData.save();
}
export const deletObjects = async () => {
    await DataModell.deleteMany({})
}
export const countDocs = async () => {
    const count = await DataModell.countDocuments();
    return count;
}
export async function deleteFav(Tid: string) {
    try {
      // Use the $pull operator to remove the item from the array
      await UserModel.updateOne(
        { 'userItems.savedItems.T_id': Tid },
        { $pull: { 'userItems.savedItems': { T_id: Tid } } }
      );
      return { success: true, message: 'Item deleted successfully' };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Failed to delete item' };
    }
  };
  export async function updateStatus(Newstatus: string, Tid: number) {
    try {
      // Update the status of the specific item with the given Tid in the savedItems array
      const result = await UserModel.updateOne(
        { 'userItems.savedItems.T_id': Tid },
        { $set: { 'userItems.savedItems.$.status': Newstatus } }
      );
  
      if (result.modifiedCount === 0) {
        console.log('No item was found with the provided Tid or status was already set to the provided value.');
        return { success: false, message: 'Item not found or status already updated' };
      }
  
      console.log('Status updated successfully.');
      return { success: true, message: 'Status updated successfully' };
    } catch (error) {
      console.error('Error updating status:', error);
      return { success: false, message: 'Error updating status' };
    }
  }
  // User Activity functions
  export async function addItemToRecord(userId: any, item: object): Promise<void> {
    try {
      await UserModel.findByIdAndUpdate(
        userId,
        { $push: { 'activity.record': item } }, // Push the new item into the record array
        { new: true } // Return the updated document
      );
      console.log('Item added to record.');
    } catch (error) {
      console.error('Error adding item to record:', error);
    }
  }

  export async function getAllItemsFromRecord(userId: any): Promise<object[] | null> {
    try {
      const user: any = await UserModel.findById(userId, 'activity.record'); // Retrieve only the activity.record field
      return user
    } catch (error) {
      console.error('Error retrieving items from record:', error);
      return null;
    }
  }
  export async function deleteItemFromRecord(Tid: any) {
    try {
      // Use the $pull operator to remove the item from the activity.record array
      const result = await UserModel.updateOne(
        { 'activity.record.timestamp': Tid }, // Find the document where activity.record contains the T_id
        { $pull: { 'activity.record': { timestamp: Tid } } } // Remove the record with the matching T_id
      );
    
      // Check if any documents were modified
      if (result.modifiedCount > 0) {
        return { success: true, message: 'Record deleted successfully' };
      } else {
        return { success: false, message: 'Record not found or already deleted' };
      }
    } catch (error) {
      console.error('Error deleting record:', error);
      return { success: false, message: 'Failed to delete record' };
    }
  }

  export async function deleteAllItemsFromRecord(userId: any) {
    try {
      await UserModel.findByIdAndUpdate(
        userId,
        { $set: { 'activity.record': [] } }, // Set the record array to an empty array
        { new: true } // Return the updated document
      );
      console.log('All items deleted from record.');
    } catch (error) {
      console.error('Error deleting all items from record:', error);
    }
  }
  

  
// Capture termination and interrupt signals
process.on('SIGINT', () => gracefulShutdown(0));  // Handle Ctrl+C
process.on('SIGTERM', () => gracefulShutdown(0)); // Handle termination signals (from a process manager)
