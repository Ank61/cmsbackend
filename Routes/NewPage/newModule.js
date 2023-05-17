const express = require("express")
const mongoose = require('mongoose')
require("dotenv").config();
const app = express()

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
app.post("/" , async(request,response)=>{
    try {
        const data = request.body.data;
        const moduleName = request.body.moduleName;
        const collectionName = request.body.collectionName;
        const newPage = mongoose.model(collectionName, newSchema);      
        const forModuleId = await newPage.find({}).clone().catch(err => response.status(400).send("Erro"))
                if(forModuleId[0].Modules.length>0){
                    const totalLengthIndex = forModuleId[0].Modules.length;
                    const lastItemIndex = totalLengthIndex-1;
                    const getModuleId = forModuleId[0].Modules[lastItemIndex]
                    const updatedResponse = await newPage.findOneAndUpdate({},
                    { $push: { Modules: { moduleName: `${moduleName}`, data: `${data}`, moduleId: `${getModuleId.moduleId +1}` } } },
                    { new: true }
                ).exec();
                return response.status(200).send(updatedResponse)
                }
                else{
                    const updatedResponse = await newPage.findOneAndUpdate({},
                        { $push: { Modules: { moduleName: `${moduleName}`, data: "", moduleId: 1 } } },
                        { new: true }
                    ).exec();
                return response.status(200).send(updatedResponse);
                }
    }
    catch (err){
        return response.status(400).send("Error has occured"+err)
    }
})
module.exports =app;