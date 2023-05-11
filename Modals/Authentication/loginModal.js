const mongoose = require("mongoose");
const schema = mongoose.Schema;
const loginSchema = new schema({
    User_Id: {
        type: Number,
    },
    User_Name: {
        type: String,
        required : true
    },
    Email: {
        type: String,
        required: true,
        unique : true
    },
    Password: {
        type: String,
        required: true
    },
    Token : {
        type:String,
    },
    Last_Login: {
        type: Date,
        default: Date.now
    },
    Login_Attempts : {
        type:Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})
const loginModal = mongoose.model("login", loginSchema)
module.exports = loginModal;