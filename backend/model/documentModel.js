const mongoose=require("mongoose")
const docList=mongoose.Schema({
    label:{
        type:String
    }
   
})
const guidelinesdocs=mongoose.Schema({
    operationId: { type: mongoose.Types.ObjectId, ref: "doclists" },
    documentName:String,
    documentOptions:String,
    businessName:String,
    referral:String,
    gst:String,
    label:String,
    imgUrl:String
})
const docLists=mongoose.model("typeOfOperations",docList)
const guidelines=mongoose.model("guidlinesDoc",guidelinesdocs)
module.exports={
    docList:docLists,
    guidlineDoc:guidelines
}