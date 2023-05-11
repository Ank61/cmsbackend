const express = require("express")
const app = express();
const headerModal = require("../../Modals/UserRoutes/header")


app.get("/" , async(request , response)=>{
    const data = await headerModal.find({}).clone().catch(err => response.status(400).send("Erro"))
    return response.status(200).send(data)
})

app.post("/update" ,async(request,response)=>{
    try{
    const data = request.body.data;
    const headerId= request.body.headerId;
    const updatedResponse = await headerModal.findOneAndUpdate( { headerId: `${headerId}` },
    {$set : {data : `${data}`}},
    {new :true}).exec();
    return response.status(200).send(updatedResponse)
    }
    catch(err){
        return response.status(400).send(err)
    }
})
module.exports = app;