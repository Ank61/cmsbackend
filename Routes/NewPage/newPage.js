const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cookieparser = require('cookie-parser');
app.use(cookieparser());
const storageModal = require("../../Modals/UserRoutes/pageStorage")
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
    const { collectionName, path } = request.body;
    const newPage = mongoose.model(collectionName, newSchema);
    const user = new newPage({
        Modules: [{
            moduleName: 'Module 1',
            data: '',
            updatedData: '',
            moduleId: 1
        }],
        title: '',
        description: '',
        formData: [''],
        pathPage: `${path}`
    });
    await user.save().then(async (data) => {
        const result = await storageModal.create({ data: collectionName });
        return response.status(200).send(result)
    }
    ).catch(err => console.log(err))
});

module.exports = app;