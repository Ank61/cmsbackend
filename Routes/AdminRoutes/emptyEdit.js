const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cookieparser = require('cookie-parser');
const { response } = require("./login");
app.use(cookieparser());

app.post("/", async(request,response)=>{
  try{
    const db = mongoose.connection.db;
  const documents = await db.collection(request.body.name).find({}).toArray();
  return response.status(200).send(documents)
  }
  catch (err) {
    return response.status(404).send(err)
}
})
app.post("/allData", async(request,response)=>{
    try{
        const db = mongoose.connection.db;
        const documents = await db.collection(request.body.name).find({}).toArray();
        const initial = "";
        const data = await documents[0].Modules.map(item => item.data).reduce((accumulator, currentValue) => accumulator + currentValue, initial)
        const obj = {
            data: data,
            rest: documents
        }
        return response.status(200).send(obj)
    }
    catch (err)
    {
        return response.status(404).send(err)
    }
})

module.exports = app;