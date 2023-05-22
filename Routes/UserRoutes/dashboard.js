const express = require("express")
const { request, response } = require("./aboutUs")
const { default: mongoose } = require("mongoose")
// const { MongoClient } = require('mongodb');
// const uri = 'mongodb+srv://test:test@cluster0.ofannid.mongodb.net/CMS?retryWrites=true&w=majority'; // Replace with your MongoDB connection URI
// const client = new MongoClient(uri);
const app = express()
app.get("/", async (request, response) => {
    try {
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        const collectionData = [];
        
        for (const collection of collections) {
          const collectionName = collection.name;
          
          if (collectionName !== 'pagestorages' && collectionName !== 'headers' && collectionName !== 'logins') {
            const documents = await db.collection(collectionName).find({}).toArray();
            
            if (documents.length > 0 && documents[0].Modules) {
              collectionData.push({ 
                name: collectionName, 
                data: documents[0].Modules.length, 
                path: documents[0].pathPage 
              });
            }
          }
        }
        
        return response.status(200).send(collectionData);
      } catch (err) {
        console.error(err); // Log the error for debugging purposes
        return response.status(500).send('Internal Server Error');
      }
});
module.exports = app;