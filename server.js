const express = require("express")
const bodyparser = require('body-parser')
const cors = require("cors")
const path = require('path')
const mongoose = require('mongoose')
require("dotenv").config();
const fs = require('fs');

const app = express()
app.use(bodyparser.json({limit: '50mb'}));
app.use(bodyparser.urlencoded({limit: '50mb', extended: true}));
// app.use(cors({origin: 'http://localhost:3000' , methods: ['GET', 'PUT', 'POST'],
// allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
// exposedHeaders: ['Content-Range', 'X-Content-Range'],
// credentials: true}))
app.use(cors({ origin: '*'})) 
const MONGO_KEY = process.env.MONGO_URL

mongoose.connect(MONGO_KEY).then((res) => {
    console.log('Database connected successfully',)
}).catch((error) => {
    console.log("Error occured while connecting",error)
})

let login = require("./Routes/AdminRoutes/login")
let mission = require("./Routes/UserRoutes/aboutUs")
let header = require("./Routes/UserRoutes/header")
let cache = require("./Routes/UserRoutes/clearCache")
let dashboard = require("./Routes/UserRoutes/dashboard")
let newPage = require("./Routes/NewPage/newPage")


app.use("/login" , login)
app.use("/aboutUs" , mission)
app.use("/header" , header)
app.use("/cache" , cache)
app.use("/dashboard" , dashboard)
app.use("/newPage" , newPage)
// app.use("/home" , homePage)
app.use(express.static(path.join(__dirname, '../build')))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build'))
})
const port = process.env.PORT || 8080;
app.listen(port,()=> {
    console.log("Server running on the port",port)
})