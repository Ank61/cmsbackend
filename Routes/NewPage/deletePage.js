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
        const moduleId = request.body.moduleId;
        const collectionName = request.body.collectionName;
        const newPage = mongoose.model(collectionName, newSchema)
        const result = await newPage.findOneAndUpdate({},
            { $pull: { Modules: { moduleId: moduleId } } },
            { new: true }).exec();
        return response.status(200).send(result)
    }
    catch (err) {
        return response.status(400).send(err)
    }
});
module.exports = app;