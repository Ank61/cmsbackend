const express = require("express")
const app = express()
const cookieparser = require('cookie-parser');
app.use(cookieparser());
const middleware = require("../../Middleware/middleware")
// const homeModal = require("../../Modals/UserRoutes/missionModal");
const homeModal = require("../../Modals/UserRoutes/homeModal");
const { body, validationResult, param, check } = require('express-validator');
const fs = require('fs');

app.get("/", async (request, response) => {
    const data = await homeModal.find({}).clone().catch(err => response.status(400).send("Erro"))
    return response.status(200).send(data)
})

app.post("/update",
    async (request, response) => {
        const fileNameForApply = '../client/src/Components/AdminComponents/Pages/AboutUs/aboutUsAdmin.css';
        const fileNameForUpdate = '../client/src/Components/UserComponents/about.css'
        try{
            if(request.body.From==="Apply"){//for Apply button module only
                if(request.body.Effect==="Developer"){
                    fs.appendFile(fileNameForApply,`${request.body.CSS}`, (err) => {
                        if (err) throw err;
                      });
                      fs.appendFile(fileNameForUpdate,`${request.body.CSS}`, (err) => {
                        if (err) throw err;
                      });
                }
            if(request.body.Effect==='Hover'){ //that means i tfor hover only
                let stringFirst = '.'+`${request.body.className}` + `${request.body.style}`;
                let stringSecond = '.'+`${request.body.className}` +":hover" + `${request.body.EffectStyle}`;
                let third =  `${stringFirst}` + '\n' + `${stringSecond}` ;
                
                fs.readFile(fileNameForApply, 'utf8', (err, data) => {
                    if (err) throw err;
                    const updatedData = data.startsWith(request.body.className);
                    //if true then only then reeplace otherwise create new
                    if(updatedData){
                        fs.writeFile(fileNameForApply, third, 'utf8', (err) => {
                            if (err) throw err;
                          });
                    }
                    else{
                         fs.appendFile(fileNameForApply,`${third}`, (err) => {
                            if (err) throw err;
                          });
                          fs.appendFile(fileNameForUpdate,`${third}`, (err) => {
                            if (err) throw err;
                          });
                    }
                })
                const data = request.body.data;
                const moduleName = request.body.moduleName;
                const moduleId = request.body.moduleId; //will thrw error not foun
                const updatedResponse = await homeModal.findOneAndUpdate(
                    { Modules: { $elemMatch: { moduleId: `${moduleId}` } } },
                    { $set: { 'Modules.$.moduleName': `${moduleName}`, 'Modules.$.data': `${data}` } },
                    { new: true },
                  ).exec();
                return response.status(200).send(updatedResponse)
            }
        }
            else{
                const data = request.body.data;
                const moduleName = request.body.moduleName;
                const moduleId = request.body.moduleId; //will thrw error not foun
                const updatedResponse = await homeModal.findOneAndUpdate(
                    { Modules: { $elemMatch: { moduleId: `${moduleId}` } } },
                    { $set: { 'Modules.$.moduleName': `${moduleName}`, 'Modules.$.data': `${data}` } },
                    { new: true },
                  ).exec();
                return response.status(200).send(updatedResponse)
            }
        }
        catch (err) {
            console.log(err)
            return response.status(200).send("Could not find")
        }
    })
app.post("/createModule",
    async (request, response) => {
        const errors = validationResult(request);
        try {
            if (!errors.isEmpty()) {
                return response.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }
            else {
                const data = request.body.data;
                const moduleName = request.body.moduleName;
                const forModuleId = await homeModal.find({}).clone().catch(err => response.status(400).send("Erro"))
                if(forModuleId[0].Modules.length>0){
                    const totalLengthIndex = forModuleId[0].Modules.length;
                    const lastItemIndex = totalLengthIndex-1;
                    const getModuleId = forModuleId[0].Modules[lastItemIndex]
                    const updatedResponse = await homeModal.findOneAndUpdate({},
                    { $push: { Modules: { moduleName: `${moduleName}`, data: `${data}`, moduleId: `${getModuleId.moduleId +1}` } } },
                    { new: true }
                ).exec()
                return response.status(200).send(updatedResponse)
                }
                else{
                    //create new
                    const updatedResponse = await homeModal.findOneAndUpdate({},
                        { $push: { Modules: { moduleName: `${moduleName}`, data: "", moduleId: 1 } } },
                        { new: true }
                    ).exec()
                return response.status(200).send(updatedResponse);
                }
            }
        }
        catch (err) {
            return response.status(400).send(err)
        }
    })

    app.get("/allData" , async(request,response)=>{ // No Middleware Required
        try{
           const availableData = await homeModal.find({}).clone()
           const initial = "";
           const data = await availableData[0].Modules.map(item=>item.data).reduce((accumulator, currentValue) => accumulator + currentValue,initial)
        const obj={
            data : data,
            rest :availableData
        }
           return response.status(200).send(obj)
        }
        catch(err){
            return response.status(400).send(err)
        }
    })

    app.post("/delete" , async(request,response)=>{
        try{
        const Id = request.body.moduleId;
        const result = await homeModal.findOneAndUpdate({},
                { $pull: { Modules: { moduleId: Id } } }, 
                { new: true }).exec();
        return response.status(200).send(result)
        }
        catch(err){
            return response.status(400).send(err) 
        }
    })
    app.post("/meta" , async(request,response)=>{
        try{
             const title = request.body.title
             const description = request.body.description;
             await homeModal.updateOne({'_id' :'642521483a2c6109b4aabbb4'},{title :`${title}` ,description : `${description}`})
             .then(()=> response.status(200).send("success"))
        }
        catch{
            return response.status(400).send(err) 
        }
    })
    app.post("/submitData" , async(request, response)=>{
        try{
            const allData = request.body;
            const toString = allData.join(", ");
        console.log(toString)
            await homeModal.findOneAndUpdate(
                {'_id' :'642521483a2c6109b4aabbb4' },
                { $push: { formData: `${toString}`}},
                { new: true },
              ).exec();
           return  response.status(200).send("Posted Successfully")
        }
        catch(err){
            return response.status(400).send(err)
        }
    })
module.exports = app;