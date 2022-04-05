const mongoose=require("mongoose")
const documentSchema=mongoose.Schema({
    name:{
        type:Array
    }
})
const document =mongoose.model("documents",documentSchema)
module.exports={
    docuemnt:document
}