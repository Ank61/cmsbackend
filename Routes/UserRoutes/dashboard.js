const express = require("express")
const { request, response } = require("./aboutUs")
const { default: mongoose } = require("mongoose")
const aboutUsModal = require("../../Modals/UserRoutes/missionModal")

const app = express()
app.get("/", async (request, response) => {
    const db = mongoose.connection;
    try {
        var array = []
        const collections = Object.keys(db.collections);
        for (const collectionName of collections) {
            if (collectionName !== 'logins' && collectionName !== 'headers') {
                const model =  await aboutUsModal.find({})
                array.push({[collectionName] : model[0]})
            }
            }
        
        return response.status(200).send(array)
    }
    catch (err) {
        return response.status(404).send(err)
    }
});
module.exports = app;