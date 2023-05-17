const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cookieparser = require('cookie-parser');
const { response } = require("./login");
app.use(cookieparser());

app.post("/", async(request,response)=>{
  try{
  const db = mongoose.connection.db;
  console.log(request.body)
  const documents = await db.collection(request.body.path).find({}).toArray();
  console.log(documents)
  return response.status(200).send(documents)
  }
  catch (err) {
    return response.status(404).send(err)
}
})
module.exports = app;