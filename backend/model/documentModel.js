const mongoose=require("mongoose")
const docList=mongoose.Schema({
    label:{
        type:String
    }
   
})
const guidelinesdocs=mongoose.Schema({
    operationId: { type: mongoose.Types.ObjectId, ref: "typeOfOperations" },
    documentName:String,
    documentOptions:String,
    businessName:String,
    referral:String,
    gst:String,
    label:String,
    imgUrl:String,
    imgUrlVoterId:String,
    labelVoterId:String,
    imgUrlDl:String,
    labelDl:String,
    imgUrlPassport:String,
    labelPassport:String,
    imgUrlShopBoardWithAddress:String,
    labelShopBoardWithAddress:String,
    imgUrlLetterHead:String,
    labelLetterhead:String,
    imgUrlBankStatement:String,
    labelBankStatement:String,
    imgUrlTelephoneBill:String,
    labelTelephoneBill:String,
    imgUrlUdogAadhaar:String,
    labelUdogAadhaar:String

})
const docLists=mongoose.model("typeOfOperations",docList)
const guidelines=mongoose.model("guidlinesDocs",guidelinesdocs)
module.exports={
    docList:docLists,
    guidlineDoc:guidelines
}