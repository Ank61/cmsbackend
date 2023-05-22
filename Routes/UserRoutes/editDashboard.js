const express = require("express")
const mongoose = require('mongoose')
const app = express()

app.post("/", async (request, response) => {
    try {
        const collectionName = request.body.collectionName;
        const newPathRoute = request.body.modulePath;
        // Update the pathRoute for the collection
        const result = await mongoose.connection.db.collection(collectionName).updateOne(
          {},
          { $set: { pathPage: newPathRoute } }
        );
        return response.status(200).send("PathRoute updated successfully");
      } catch (err) {
        return response.status(400).send(err);
      }
  });
module.exports = app;