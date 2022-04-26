const mongoose=require("mongoose")
const docList=mongoose.Schema({
    label:{
        type:String
    },
    doc:{
        type:Array
    }
   
    
})
const docLists=mongoose.model("doclist",docList)

module.exports={
    docList:docLists
}