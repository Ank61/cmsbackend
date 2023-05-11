const mongoose = require("mongoose");
const schema = mongoose.Schema
const headerSchema = new schema({
        data : {
            type :String
        },
        headerId : {
            type:String
        }
}) 

const headerModal = mongoose.model("header" , headerSchema);
module.exports = headerModal;