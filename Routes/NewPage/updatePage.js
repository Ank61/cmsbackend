const express = require("express")
const app =express();
const mongoose = require("mongoose");

const schema = mongoose.Schema;
        const newSchema = schema({
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
        const data = request.body.data;
        const moduleName = request.body.moduleName;
        const moduleId = request.body.moduleId;
        const collectionName = request.body.collectionName;
        const newPage = mongoose.model(collectionName, newSchema);
        const updatedResponse = await newPage.findOneAndUpdate(
            { Modules: { $elemMatch: { moduleId: `${moduleId}` } } },
            { $set: { 'Modules.$.moduleName': `${moduleName}`, 'Modules.$.data': `${data}` } },
            { new: true },
        ).exec();
        return response.status(200).send(updatedResponse)
    }
    catch (err) {
        return response.status(404).send(err)
    }
});

module.exports =app;