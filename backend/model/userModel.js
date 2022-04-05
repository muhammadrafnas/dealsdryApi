const mongoose = require("mongoose")
//user schema 
const userSchema = mongoose.Schema({
    phoneNumber: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    referral: {
        type: String
    },
    gstInNumber: {
        type: String
    },
    gstInProof: {
        type: String
    },
    category: {
        type: Array
    },
    businessAddressBiiling: {
        type: Array
    },
    businessAddressShipping: {
        type: Array
    },
    documents: {
        type: Array
    },
    businessType:{
        type:String
    },
    emailVerified:{
        type:String
    }

})
const businessSchema = mongoose.Schema({
    businessName: {
        type: String
    },
    businessType: {
        type: String
    },
    ownerName: {
        type: String
    },
    pancardNumber: {
        type: String
    },
    userId: { type: mongoose.Types.ObjectId, ref: "users" },
    pancard: {
        type: String
    }
})

const businessDiffrentSchema = mongoose.Schema({
    businessName: {
        type: String
    },
    businessType: {
        type: String
    },
    ownerName: {
        type: String
    },
    pancardNumber: {
        type: String
    },
    userId: { type: mongoose.Types.ObjectId, ref: "users" },
    pancard: {
        type: String
    },
    contactPerson: {
        type: String
    },
    desigination: {
        type: String
    }
})
const whatsappSubscription = mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: "users" },
    phoneNumber: {
        type: Number
    }
})
const business = mongoose.model("business", businessSchema)
const businessDiffrent = mongoose.model("businessContact", businessDiffrentSchema)
const user = mongoose.model("users", userSchema)
const whatsappSub=mongoose.model("whatsappSubscription",whatsappSubscription)
module.exports = {
    user: user,
    business: business,
    businessDiffrent: businessDiffrent,
    whatsappSubscription:whatsappSub
}