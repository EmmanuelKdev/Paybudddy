
import fs from 'fs';
import path from 'path';


export async function loadJsonData(): Promise<any> {
    // Step 1: Define the path to the JSON file
    const filePath = path.join(__dirname, '../data.json'); // Adjust the path as necessary
  
    // Step 2: Read the file asynchronously
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(`Error reading the file: ${err}`);
        } else {
          try {
            // Step 3: Parse the data from JSON text to JavaScript object
            const jsonData = JSON.parse(data);  // This is where the data is extracted
            resolve(jsonData);  // Return the parsed data
          } catch (parseErr) {
            reject(`Error parsing the JSON data: ${parseErr}`);
          }
        }
      });
    });
  }
  
  // Usage:
 