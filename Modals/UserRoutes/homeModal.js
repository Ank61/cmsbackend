const mongoose = require("mongoose")
const schema = mongoose.Schema;
const home = new schema({
    Modules: [{
        moduleName: {
            type: String,
            unique :true,
        },
        data: {
            type: String
        },
        updatedData: {
            type: String
        },
        moduleId : {
            type: Number,
            required :true,
            unique :true,
        }
    }],
    title : {
        type:String
    },
    description :{
        type : String
    },
    formData : {
        type : [String]
    }
})

const homeModal = mongoose.model("home", home)
module.exports = homeModal;