const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cookieparser = require('cookie-parser');
app.use(cookieparser());
const aboutUsModal = require("../../Modals/UserRoutes/missionModal");
const { body, validationResult, param, check } = require('express-validator');
const fs = require('fs');
const storageModal = require("../../Modals/UserRoutes/pageStorage")

app.post("/", async (request, response) => {
    const { collectionName, path } = request.body;
    const schema = mongoose.Schema;
    const newSchema = new schema({
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
    const newPage = mongoose.model(`${collectionName}`, newSchema);
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
    await user.save().then(async (response) => {
        const result = await storageModal.create({ data: collectionName });
        return response.status(200).send("Created new Page")
    }
    ).catch(err => console.log(err))
});

// app.post("/update", async (request, response) => {
//     try {
//         const data = request.body.data;
//         const moduleName = request.body.moduleName;
//         const moduleId = request.body.moduleId;
//         const collectionName = request.body.collectionName;
//         console.log(data,moduleName ,moduleId , collectionName)
//         const schema = mongoose.Schema;
//         const newSchema = new schema({
//             Modules: [{
//                 moduleName: {
//                     type: String,
//                     unique: true,
//                 },
//                 data: {
//                     type: String
//                 },
//                 updatedData: {
//                     type: String
//                 },
//                 moduleId: {
//                     type: Number,
//                     required: true,
//                     unique: true,
//                 }
//             }],
//             title: {
//                 type: String
//             },
//             description: {
//                 type: String
//             },
//             formData: {
//                 type: [String]
//             },
//             pathPage: {
//                 type: String
//             }
//         })
//         const newPage = mongoose.model(`${collectionName}`, newSchema);
//         console.log("hit in updtae button")
//         const updatedResponse = await newPage.findOneAndUpdate(
//             { Modules: { $elemMatch: { moduleId: `${moduleId}` } } },
//             { $set: { 'Modules.$.moduleName': `${moduleName}`, 'Modules.$.data': `${data}` } },
//             { new: true },
//         ).exec();
//         console.log(updatedResponse)
//         return response.status(200).send(updatedResponse)
//     }
//     catch (err) {
//         return response.status(404).send(err)
//     }
// });
// app.post("/delete", async (request, response) => {
//     try {
//         const moduleId = request.body.moduleId;
//         const collectionName = request.body.collectionName;
//         console.log(request.body)
//         const schema = mongoose.Schema;
//         const newSchema =  new schema({
//             Modules: [{
//                 moduleName: {
//                     type: String,
//                     unique: true,
//                 },
//                 data: {
//                     type: String
//                 },
//                 updatedData: {
//                     type: String
//                 },
//                 moduleId: {
//                     type: Number,
//                     required: true,
//                     unique: true,
//                 }
//             }],
//             title: {
//                 type: String
//             },
//             description: {
//                 type: String
//             },
//             formData: {
//                 type: [String]
//             },
//             pathPage: {
//                 type: String
//             }
//         })
//         console.log("Dleete" , `${collectionName}` , typeof `${collectionName}`)
//         const newPage = mongoose.model(`${collectionName}`, newSchema)
//         console.log("hit in delte")
//         const result = await newPage.findOneAndUpdate({},
//             { $pull: { Modules: { moduleId: moduleId } } },
//             { new: true }).exec();
//             console.log("///////////",result)
//         return response.status(200).send(result)
//     }
//     catch (err) {
//         return response.status(400).send(err)
//     }
// });

// app.post("/updateModule" , async(request,response)=>{
//     try {
//         console.log("Update Module" ,request)
//         const data = request.body.data;
//         const moduleName = request.body.moduleName;
//         const moduleId = request.body.moduleId;
//         const collectionName = request.body.collectionName;
//         const schema = mongoose.Schema;
//         const newSchema = new schema({
//             Modules: [{
//                 moduleName: {
//                     type: String,
//                     unique: true,
//                 },
//                 data: {
//                     type: String
//                 },
//                 updatedData: {
//                     type: String
//                 },
//                 moduleId: {
//                     type: Number,
//                     required: true,
//                     unique: true,
//                 }
//             }],
//             title: {
//                 type: String
//             },
//             description: {
//                 type: String
//             },
//             formData: {
//                 type: [String]
//             },
//             pathPage: {
//                 type: String
//             }
//         })
//         const newPage = mongoose.model(`${collectionName}`, newSchema);
//         console.log("hit in Creat new module")        
//         const forModuleId = await newPage.find({}).clone().catch(err => response.status(400).send("Erro"))
//                 if(forModuleId[0].Modules.length>0){
//                     const totalLengthIndex = forModuleId[0].Modules.length;
//                     const lastItemIndex = totalLengthIndex-1;
//                     const getModuleId = forModuleId[0].Modules[lastItemIndex]
//                     const updatedResponse = await newPage.findOneAndUpdate({},
//                     { $push: { Modules: { moduleName: `${moduleName}`, data: `${data}`, moduleId: `${getModuleId.moduleId +1}` } } },
//                     { new: true }
//                 ).exec()
//                 console.log(updatedResponse)
//                 return response.status(200).send(updatedResponse)
//                 }
//                 else{
//                     //create new
//                     const updatedResponse = await newPage.findOneAndUpdate({},
//                         { $push: { Modules: { moduleName: `${moduleName}`, data: "", moduleId: 1 } } },
//                         { new: true }
//                     ).exec()
//                 return response.status(200).send(updatedResponse);
//                 }
//     }
//     catch (err){
//         return response.status(400).send(err)
//     }
// })
module.exports = app;