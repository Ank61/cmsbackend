const mongoose = require("mongoose")
const schema = mongoose.Schema;
const aboutUs = new schema({
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

const aboutUsModal = mongoose.model("AboutU", aboutUs)
module.exports = aboutUsModal;