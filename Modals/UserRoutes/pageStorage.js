const mongoose = require("mongoose")
const schema = mongoose.Schema;
const storageSchema = new schema({
data : {
    type : [String]
}
});
const pageStorage = mongoose.model("pageStorage", storageSchema)
module.exports = pageStorage;