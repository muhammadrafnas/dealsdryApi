const { reject } = require("bcrypt/promises")
const { user, business, businessDiffrent, whatsappSubscription } = require("../model/userModel")
const { docuemnt, documentGstNo } = require("../model/documentModel")
const bcrypt = require('bcrypt')
module.exports = {
    checkPhone: (phoneNumber) => {
        return new Promise(async (resolve, reject) => {
            let exist = await user.find({
                phoneNumber: phoneNumber
            })
            console.log(exist != null);
            if (exist.length != 0) {
                resolve({ status: true, user: exist })
            } else {
                resolve({ status: false })
            }

        })
    },
    doSignupPhone: (phoneNumber) => {
        return new Promise(async (resolve, reject) => {
            let data = await user.create({
                phoneNumber: phoneNumber
            })
            if (data) {
                resolve(data)
            }
        }).catch(error => {
            console.log(error);
        })
    },
    registrationEmail: (data) => {
        console.log(data);
        return new Promise(async (resolve, reject) => {
            data.password = await bcrypt.hash(data.password, 10)
            console.log(password);
            let userData = await user.updateOne({ _id: data.userId }, {
                $set: {
                    email: data.email, password: data.password, refferal: data.referralcode
                }
            }
            )
            console.log(userData);
            if (userData != null) {
                resolve({ status: true, data: userData })
            }
            else {
                resolve({ status: false })
            }
        })
    },
    registrationGstYes: (userData) => {
        return new Promise(async (resolve, reject) => {
            let data = await user.findByIdAndUpdate(userData.userId, {
                gstInNumber: userData.gstinNumber,
                gstInProof: userData.gstinProof
            })
            if (data) {
                resolve(data)
            }
        })
    },
    registrationSelectCategory: (category, userId) => {
        console.log(category);
        return new Promise(async (resolve, reject) => {
            let userData = await user.findByIdAndUpdate(userId, {
                category: category
            })
            if (userData) {
                resolve(userData)
            }
        })
    },
    getBusinessDetials: () => {
        return new Promise(async (resolve, reject) => {
            let data = await business.find(
                {}
            )
            console.log(data);
            resolve(data)
        })
    },
    getBusinessDetialsDiffrent: () => {
        return new Promise(async (resolve, reject) => {
            let data = await businessDiffrent.find({
            })
            if (data) {
                resolve(data)
            }
        })
    },
    getDocuments: () => {
        return new Promise(async (resolve, reject) => {
            let data = await docuemnt.find({
            })
            if (data) {
                resolve(data)
            }
        })
    },
    businessAddress: (data, userId) => {
        return new Promise(async (resolve, reject) => {
            let response = await user.findByIdAndUpdate(userId, {
                businessAddressBiiling: data
            })
            if (response) {
                resolve(response)
            }
        })
    },
    businessAddressShipping: (data, userId) => {
        return new Promise(async (resolve, reject) => {
            let response = await user.findByIdAndUpdate(userId, {
                businessAddressShipping: data
            })
            if (response) {
                resolve(response)
            }
        })
    },
    uploadDocument: (documents, userId) => {
        return new Promise(async (resolve, reject) => {
            let data = await user.findByIdAndUpdate(userId, {
                documents: documents
            })
            if (data) {
                resolve(data)
            }
        })
    },
    whatsappSubscription: (userId) => {
        return new Promise(async (resolve, reject) => {
            let data = await user.findOne({
                _id: userId
            })
            let subscription = await whatsappSubscription.create({
                userId: userId, phoneNumber: data.phoneNumber
            })
            if (subscription) {
                resolve(subscription)
            }
        })
    },
    businessType: (userData) => {
        console.log(userData);
        return new Promise(async (resolve, reject) => {
            let data = await user.findByIdAndUpdate(userData.userId, {
                businessType: userData.type
            })
            if (data) {
                resolve(data)
            }
        })
    },
    getEmail: (userId) => {
        return new Promise(async (resolve, reject) => {
            let data = await user.findOne({
                _id: userId
            })
            if (data) {
                resolve(data)
            }
        })
    },
    emailVerified: (userId) => {
        return new Promise(async (resolve, reject) => {
            let data = await user.findByIdAndUpdate(userId, {
                emailVerified: "success"
            })
            if (data) {
                resolve(data)
            }
        })
    },
    getPendencyDocument: (userID) => {
        return new Promise(async (resolve, reject) => {
            let user = await user.findOne({
                _id: userID
            })
            console.log(user.documents);
        })
    },
    gstNoemail: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.password = await bcrypt.hash(userData.password, 10)
            let data = await user.findByIdAndUpdate(userData.userId, {
                email: userData.email, password: userData.password
            })
        })
    },
    gstNo: (userData) => {
        return new Promise(async (resolve, reject) => {
            let data = await user.findByIdAndUpdate(userData.userId, {
                pancardNumber: userData.pancardNumber, pancard: userData.pancard
            })
            if (data) {
                resolve(data)
            }
        })
    },
    getDocumentsGstNo: (userData) => {
        return new Promise(async (resolve, reject) => {
            let data = await documentGstNo.find({

            })
            if(data){
                resolve(data)
            }
        })
    },
    uplodDocumentsGstNo:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let data=await user.findByIdAndUpdate(userData.userId,{
                documentsGstNo:userData
            })
           if(data){
               resolve(data)
           }
        })
    },
    getPendencyDocumentGstNo:(userID)=>{
        return new Promise(async(resolve,reject)=>{
            let data=await user.findOne({
                _id:userID
            })
            
        })
    }
}