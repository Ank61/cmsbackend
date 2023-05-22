const express = require("express")
const mongoose = require('mongoose')
const app = express()

const schema = mongoose.Schema;
const newSchema =   schema({
    Modules: [{
        moduleName: {
            type: String,
            unique: true,
        },
        data: {
            type: String
        },
        updatedData: {
            type: String
        },
        moduleId: {
            type: Number,
            required: true,
            unique: true,
        }
    }],
    title: {
        type: String
    },
    description: {
        type: String
    },
    formData: {
        type: [String]
    },
    pathPage: {
        type: String
    }
})

app.post("/", async (request, response) => {
    try {
      console.log(request.body.collectionName)
      const collectionName = request.body.collectionName;
      await mongoose.connection.db.dropCollection(collectionName);
      return response.status(200).send("Collection deleted successfully");
    } 
    catch (err) {
      return response.status(400).send(err);
    }
  });
module.exports = app;