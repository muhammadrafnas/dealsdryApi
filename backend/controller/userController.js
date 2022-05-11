const { reject, promise } = require("bcrypt/promises")
const { user, business, businessDiffrent, whatsappSubscription } = require("../model/userModel")
const { docList, guidlineDoc } = require("../model/documentModel")
const {gstDetailsGetfromApi,panDetailsGetfromApi}=require("../utils/zoopApi")
const Category = require("../model/categoryModel")
const { Device } = require("../model/deviceModel")
const bcrypt = require('bcrypt')
const { geoLocation } = require("../utils/geoLocation")
const { default: mongoose } = require("mongoose")
const { UserList } = require("twilio/lib/rest/conversations/v1/user")


module.exports = {

    /*
        Controller file store the data and get data from the data base
    */

    checkPhone: (mobileNumber) => {
        return new Promise(async (resolve, reject) => {
            let exist = await user.find({
                mobile_number: mobileNumber
            }).select("_id")
            if (exist.length != 0) {
                resolve({ status: true, user: exist })
            } else {
                resolve({ status: false })
            }

        }).catch((err) => {
            if (err) {
                console.log("err");
            }
        })
    },
    mobileRegistration: (phoneNumber, userId) => {
        return new Promise(async (resolve, reject) => {
            let data = await user.findByIdAndUpdate(userId, {
                mobile_number: phoneNumber
            })
            console.log(data);
            if (data) {
                resolve(data._id)
            }
            else {
                resolve()
            }
        })
    },

    /*
Email and password and referral is optional store to database
Funcation calling from Registration router password storing becrypt format for security purpose
    */

    emailPasswordReferralRegistartion: (data) => {
        return new Promise(async (resolve, reject) => {
            data.password = await bcrypt.hash(data.password, 10)
            let userData = await user.findByIdAndUpdate(data.userId, {
                email: data.email, password: data.password, referral_id: data.referralCode

            }
            ).catch((err) => {
                reject(err)
            })
            console.log(userData);
            if (userData) {
                resolve(userData)
            }
            else {
                resolve()
            }
        })
    },

    /*
    Email storing without refferal 
    */
    emailPasswordRegistartion: (data) => {
        console.log("testing");
        console.log(data);
        return new Promise(async (resolve, reject) => {
            data.password = await bcrypt.hash(data.password, 10)
            let userData = await user.findByIdAndUpdate(data.userId, {
                email: data.email, password: data.password
            }
            ).catch((err) => {
                reject(err)
            })
            if (userData) {
                resolve(userData)
            }
            else {
                resolve()
            }
        })
    },


    /*
    @GST gst confirmation if gst yes call this funaction
    */

    gstinYes: (userData, proof, gstDetails) => {
        return new Promise(async (resolve, reject) => {
            let gstExist = await user.findOne({ "gstin_yes.gstin_number": userData.gstinNumber })
            if (gstExist) {
                resolve({ gst: true })
            }
            else {
                let data = await user.findByIdAndUpdate(userData.userId, {
                    "gstin_yes.gstin_number": userData.gstinNumber,
                    "gstin_yes.gstin_document": "http://54.234.115.71:5000/document/" + proof,
                    "gstin_yes.gst_details": gstDetails
                }).catch((err) => {
                    reject(err)
                })
                if (data) {
                    resolve({ gst: false })
                }
                else {
                    resolve()
                }
            }
        })
    },
    gstNo: (userData, docuemnt) => {
        return new Promise(async (resolve, reject) => {
            let pancardExist = await user.findOne({ "gstin_no.pan_number": userData.panNumber })
            if (pancardExist) {
                resolve({ pancard: true })
            }
            let panDetails=await panDetailsGetfromApi(userData.panNumber)
            console.log(panDetails);
            let data = await user.findByIdAndUpdate(userData.userId, {
                "gstin_no.pan_number": userData.panNumber,
                "gstin_no.pancard_document": "http://54.234.115.71:5000/document/" + docuemnt,
                "gstin_no.pan_Details": panDetails
            }).catch((err) => {
                reject(err)
            })
            if (data) {
                resolve({ pancard: false })
            }
            else {
                resolve()
            }
        })
    },

    /*
    Registarion user select the category store to the data base
    */

    registrationSelectCategory: (category, userId) => {
        console.log(category);
        return new Promise(async (resolve, reject) => {
            let userData = await user.findByIdAndUpdate(userId, {
                category: category
            }).catch((err) => {
                reject(err)
            })
            if (userData) {
                resolve(userData)
            }
            else {
                resolve()
            }
        })
    },

    /*
    @Business 
    get Business details from database
    */
    getBusinessDetialsGst: (userId) => {
        console.log(userId);
        return new Promise(async (resolve, reject) => {
            let data = await user.findOne(
                { _id: userId }
            ).select("gstin_yes.gst_details.legal_name gstin_yes.gst_details.trade_name   gstin_yes.gst_details.type_Of_operation gstin_yes.gstin_number gstin_yes.gstin_document ").catch((err) => {
                reject(err)
            })
            console.log("data");
            console.log(data);
            resolve(data)
        }).catch((err) => {
            reject(err)
        })
    },
    getBusinessDetialsPanCard: (userId) => {
        return new Promise(async (resolve, reject) => {
            let data = await user.findOne({
                _id: userId
            }).select("gstin_no.pan_Details gstin_no.pan_number gstin_no.pancard_document ").catch((err) => {
                reject(err)
            })
            if (data) {
                console.log(data);
                resolve(data)
            }
            else {
                resolve()
            }
        })
    },
    /*
   @Type of operaton 
   get type of operation from database label and id of the 
   type of operation
   */

    getTypeOfOperation: () => {
        return new Promise(async (resolve, reject) => {
            let typeOfOperations = await docList.find({
            })
            if (typeOfOperations) {
                resolve(typeOfOperations)
            }
            else {
                resolve()
            }
        })
    },


    /*
   @Business 
   This is the post data .data store into database 
   after adding the data promise resolve eny error is found
   promise reject

   */

    postBusinessDetails: (userData, pancard) => {
        if (pancard != null) {
            pancard = "http://54.234.115.71:5000/document/" + pancard
        }
        return new Promise(async (resolve, reject) => {
            let data = await user.findByIdAndUpdate(userData.userId, {
                "business_details.businessName": userData.businessName,
                "business_details.businessType": userData.businessType,
                "business_details.businessAuthorizedName": userData.businessAuthorizedName,
                "business_details.pancardNumber": userData.pancardNumner,
                "business_details.pancard": pancard,
                "business_details.contactPerson": userData.contactPerson,
                "business_details.desigination": userData.desigination
            }).catch((err) => {
                reject(err)
            })
            if (data) {
                resolve(data)
            }
            else {
                resolve()
            }
        })
    },
    getGuidelinesDoc: (operationId, referral, gst, userId) => {
        return new Promise(async (resolve, reject) => {
            let uploadedDocUrl={
                pancard:null,
                businessProof:null,
                shippingAddressProof:null
            }
            let documentsList = await guidlineDoc.find({
                operationId: operationId, referral: referral, gst: gst

            }).catch((err) => {
                reject(err)
            })
            let userDetails = await user.findOne({
                _id: userId
            }).select("business_details.businessAuthorizedName business_details.businessName gstin_no gstin_yes business_billing_address  business_shipping_address ")
            if (userDetails && documentsList) {
                if (userDetails.gstin_no.pancard_document) {
                    for (let x of documentsList) {
            
                        if (x.documentName == "PAN Card") {
                            x.label = "PAN Card"
                            x._doc.docurl = userDetails.gstin_no.pancard_document
                            uploadedDocUrl["pancard"]=userDetails.gstin_no.pancard_document
                        }
                        if(x.documentName == "Business proof"){
            
                            if(userDetails.business_billing_address.buyer_business_address_proof_name){
                              
                                x.label = "Business proof"
                                x._doc.docurl = userDetails.business_billing_address.buyer_business_address_proof_name
                                uploadedDocUrl["businessProof"]= userDetails.business_billing_address.buyer_business_address_proof_name
                            }
                        }
                        if(x.documentName == "Shipping Address proof"){
                            let count=userDetails.business_shipping_address.length
                            if(userDetails.business_shipping_address !=0){
                                x.label = "Shipping Address proof"
                                x._doc.docurl = userDetails.business_shipping_address[count-1].buyer_business_address_proof_name
                                uploadedDocUrl["shippingAddressProof"]= userDetails.business_shipping_address[count-1].buyer_business_address_proof_name
                            }
                        }
                        if (x.documentName == "PAN Card" || x.documentName == "Personal Address proof front copy" || x.documentName == "Personal Address proof back copy") {
                            x._doc.ownerName = userDetails.business_details.businessAuthorizedName
                        }
                        else {
                            x._doc.ownerName = userDetails.business_details.businessName
                        }
                    }
                }
                if (userDetails.gstin_yes.gstin_document) {
                    for (let x of documentsList) {
                        if (x.documentName == "Business proof") {
                            x.label = "Business proof"
                            x._doc.docurl = userDetails.gstin_yes.gstin_document;
                            uploadedDocUrl["businessProof"]= userDetails.gstin_yes.gstin_document
                        }
                        if (x.documentName == "Shipping Address proof") {
                            x.label = "Shipping Address proof"
                            x._doc.docurl = userDetails.gstin_yes.gstin_document
                            uploadedDocUrl["shippingAddressProof"]=userDetails.gstin_yes.gstin_document
                        }
                        if (x.documentName == "PAN Card" || x.documentName == "Personal Address proof front copy" || x.documentName == "Personal Address proof back copy" ) {
                            x._doc.ownerName = userDetails.business_details.businessAuthorizedName
                
                        }
                        else {
                            x._doc.ownerName = userDetails.business_details.businessName
                        }
                    }
                }
                resolve({ guidelinesDoc: documentsList,uploadedDocUrl:uploadedDocUrl })
            }
            else {
                resolve()
            }
        })
    },
    businessAddress: (data, userId, addressProof) => {
        if (addressProof != null) {
            addressProof = "http://54.234.115.71:5000/document/" + addressProof
        }
        return new Promise(async (resolve, reject) => {
            let response = await user.findByIdAndUpdate(userId, {
                   
                "business_billing_address.business_billing_address_pin_code": data.pinCode,
                "business_billing_address.business_billing_address_town_area": data.town,
                "business_billing_address.business_billing_address": data.billingAddress,
                "business_billing_address.business_billing_address_landmark": data.landmark,
                "business_billing_address.business_billing_address_city": data.city,
                "business_billing_address.business_billing_address_state": data.state,
                "business_billing_address.buyer_business_address_proof_name": addressProof,
                "business_billing_address.business_billing_address_type": data.addressType,
                "business_billing_address.business_contact_person_name": data.contactPersonName,
                "business_billing_address.business_contact_person_mobile": data.contactPersonMobile,

            }).catch((err) => {
                reject(err)
            })
            if (response) {
                resolve(response)
            }
            else {
                resolve()
            }
        })
    },
    businessAddressShipping: (data, userId, shippingAddressProof) => {
        if (shippingAddressProof != null) {
            shippingAddressProof = "http://54.234.115.71:5000/document/" + shippingAddressProof
        }
        return new Promise(async (resolve, reject) => {
            let response = await user.findByIdAndUpdate(userId, {
                $push:
                {
                    business_shipping_address: {
                        business_shipping_address_pin_code: data.pinCode,
                        business_shipping_address_town_area: data.townArea,
                        business_shipping_address: data.billingAddress,
                        business_shipping_address_landmark: data.landmark,
                        business_shipping_address_city: data.city,
                        business_shipping_address_state: data.state,
                        business_shipping_address_type: data.addressType,
                        business_contact_person_name: data.contactPersonName,
                        business_contact_person_mobile: data.contactPersonMobile,
                        buyer_business_address_proof_name: shippingAddressProof
                    }
                }
            }).catch((err) => {
                reject(err)
            })
            if (response) {
                resolve(response)
            }
            else
            {
                resolve()
            }
        })
    },
    uploadDocuments: (document, docId, gst, referral, userId) => {
        let doc = {}
        for (let x in document) {
            for (let y of Object.values(document)) {
                doc[x] = "http://54.234.115.71:5000/document/" + Object.values(y[0].filename).join("")
            }
        }
        console.log(doc);
        return new Promise(async (resolve, reject) => {
            let data = await user.findByIdAndUpdate(userId, {
                "documents.docId": docId,
                "documents.pan_card": doc.panCard,
                "documents.personal_address_proof_front_copy": doc.addressProofFront,
                "documents.personal_address_proof_back_copy": doc.addressProofBack,
                "documents.business_proof": doc.businessProof,
                "documents.shipping_address_proof": doc.shippingAddreesProof,
                "documents.shop_owner_photo": doc.shopOwnerPhoto,
                "documents.shop_board_photo": doc.shopBoardPhoto,
                "documents.firm_pancard": doc.firmPancard,
                "documents.partnership_deed": doc.partnershipDeed,
                "documents.certificate_incorporation": doc.certificateIncorporation,
                "documents.memorandum_association": doc.memorandumAssociation,
                "documents.articles_Association": doc.ArticlesAssociation,
                "documents.gst": gst,
                "documents.referral": referral
            }).catch((err) => {
                reject(err)
            })
            if (data) {
                resolve(data)
            }
        })
    },
    whatsappSubscription: (userId, mobileNumber) => {
        return new Promise(async (resolve, reject) => {
            let subscription = await whatsappSubscription.create({
                userId: userId, mobile_number: mobileNumber
            }).catch((err) => {
                reject(err)
            })
            if (subscription) {
                resolve(subscription)
            }
            else {
                resolve()
            }
        })
    },
    businessType: (userData) => {
        console.log(userData);
        return new Promise(async (resolve, reject) => {
            let data = await user.findByIdAndUpdate(userData.userId, {
                business_type: userData.type
            }).catch((err) => {
                reject(err)
            })
            if (data) {
                resolve(data)
            }
            else {
                resolve()
            }
        })
    },
    getEmail: (userId,email) => {
        return new Promise(async (resolve, reject) => {
            let data = await user.findByIdAndUpdate(userId,{
                email: email
            }).catch((err) => {
                reject(err)
            })
            if (data) {
                resolve(data)
            }
        })
    },
    emailVerified: (userId) => {
        return new Promise(async (resolve, reject) => {
            let data = await user.findByIdAndUpdate(userId, {
                email_verified: "success"
            }).catch((err) => {
                reject(err)
            })
            if (data) {
                resolve(data)
            }
        })
    },

    getWithoutPendencyDocumnet: (userId) => {
        userId = mongoose.Types.ObjectId(userId)
        return new Promise(async (resolve, reject) => {
            let userDetails = await user.aggregate([
                { $match: { _id: userId } },
                {
                    $lookup: {
                        from: "whatsappsubscriptions",
                        localField: "_id",
                        foreignField: "userId",
                        as: "whatsappSub"
                    }
                }
            ]).catch((err) => {
                reject(err)
            })
            let response = {}
            if (userDetails) {
                console.log(userDetails);
                if (!userDetails[0].whatsappSub.length == 0) {
                    response.whatsapp = " Whatsapp subscribed"
                }
                else {
                    response.whtsapp = "Whatsapp not subscribed"
                }
                if (userDetails[0].email_verified) {
                    response.email = "Emailverfied"
                }
                else {
                    response.email = "Email not verfied"
                }
                resolve(response)
            } else {
                resolve({ user: "user not found" })
            }
        }).catch((err) => {
            reject(err)
        })
    },
    getPendencyDocument: (userID, gst, referral, operationId) => {
        userID = mongoose.Types.ObjectId(userID)
        let pendency = {}
        let doc = []
        return new Promise(async (resolve, reject) => {
            let documents = await guidlineDoc.find({
                operationId: operationId, gst: gst, referral: referral
            })
            let userData = await user.aggregate([
                { $match: { _id: userID } },
                {
                    $lookup: {
                        from: "whatsappsubscriptions",
                        localField: "_id",
                        foreignField: "userId",
                        as: "whatsappSub"
                    }
                },
                {
                    $lookup: {
                        from: "guidlinesdocs",
                        localField: "documents.docId",
                        foreignField: "operationId",
                        as: "doc"
                    }
                },


            ]).catch((err) => {
                reject(err)
            })

            if (!userData.length == 0) {
                let countOne=userData[0].business_shipping_address.length
                if (!userData[0].doc.length == 0) {
                    for (let x of userData[0].doc) {
                        if (x.gst == gst && x.referral == referral) {
                
                            let docname = Object.values(x.documentName).join("").replace(/ /g, "_")
                           
                            if(userData[0].gstin_no && docname.toLowerCase()=="pan_card" || userData[0].business_shipping_address.length !=0 && userData[0].business_shipping_address[countOne-1].buyer_business_address_proof_name && docname.toLowerCase()=="shipping_address_proof" ){
                                  //NO DATA PUSH TO ARRAY
                            }
                            else if(userData[0].gstin_yes && docname.toLowerCase()=="business_proof" || userData[0].business_billing_address  && userData[0].business_billing_address.buyer_business_address_proof_name && docname.toLowerCase()=="business_proof" ||  userData[0].gstin_yes && docname.toLowerCase()=="shipping_address_proof"  ){
                                  //NO DATA PUSH TO ARRAY
                            }
                            else if (Object.keys(userData[0].documents).includes(docname.toLowerCase()) == false) {
                                doc.push(x)
                            }
                        }
                    }
                    pendency.documents = doc
                }
                else {
                    for(let x of documents){
                        let docname = Object.values(x.documentName).join("").replace(/ /g, "_")
                       
                        if(userData[0].gstin_no && docname.toLowerCase()=="pan_card" || userData[0].business_shipping_address.length !=0 && userData[0].business_shipping_address[countOne-1].buyer_business_address_proof_name && docname.toLowerCase()=="shipping_address_proof"  ){
                          //NO DATA PUSH TO ARRAY
                        }
                        else if(userData[0].gstin_yes && docname.toLowerCase()=="business_proof" || userData[0].gstin_yes && docname.toLowerCase()=="shipping_address_proof" || userData[0].business_billing_address && userData[0].business_billing_address.buyer_business_address_proof_name && docname.toLowerCase()=="business_proof") 
                        {
                          //NO DATA PUSH TO ARRAY
                          console.log(x);
                        }
                        else{
                            doc.push(x)
                        }
                    }
                    pendency.documents = doc
                }

                if (userData[0].whatsappSub.length == 0) {
                    pendency.whatsapp = " Whatsapp not subscribed"
                }
                if (!userData[0].email_verified) {
                    pendency.email = "Email not verfied"
                }
            }
            else {
                resolve()
            }
            resolve(pendency)
        }).catch((err) => {
            reject(err)
        })
    },
    userDataInfo: (userId) => {
        return new Promise(async (resolve, reject) => {
            let userData = await user.findOne({
                _id: userId
            }).select("business_details.businessAuthorizedName business_details.businessName email mobile_number gstin_yes.gstin_number gstin_no.pan_number business_billing_address business_shipping_address")
            let userInfo = {}
            if (userData) {
                console.log(userData);
                userInfo["businessName"] = userData.business_details.businessName
                userInfo["businessAuthorizedName"] = userData.business_details.businessAuthorizedName
                userInfo["email"] = userData.email
                userInfo["mobile_number"] = userData.mobile_number
                userInfo["gstin_yes.gstin_number"] = userData.gstin_yes.gstin_number
                userInfo["gstin_no.pan_number"] = userData.gstin_no.pan_number
                if(userData.business_billing_address.business_billing_address){
                    userInfo["business_billing_address"] = userData.business_billing_address.business_billing_address
                    userInfo["state"] = userData.business_billing_address.business_billing_address_state
                    userInfo["town"] = userData.business_billing_address.business_billing_address_town_area
                    userInfo["pincode"] = userData.business_billing_address.business_billing_address_pin_code
                }
                else if(userData.business_shipping_address.length !=0)
                {
                      let count=userData.business_shipping_address.length
                      userInfo["business_shipping_address"] = userData.business_shipping_address[count-1].business_shipping_address
                      userInfo["state"] = userData.business_shipping_address[count-1].business_shipping_address_state
                      userInfo["town"] = userData.business_shipping_address[count-1].business_shipping_address_town_area
                      userInfo["pincode"] = userData.business_shipping_address[count-1].business_shipping_address_pin_code

                }
                resolve(userInfo)
            }
            else {
                resolve()
            }
        })
    },
    addDevice: (userData) => {
        return new Promise(async (resolve, reject) => {
            let device = await Device.findOne({ deviceId: userData.deviceId })
            console.log("device" + device);
            if (device) {
                let deviceCollection = await Device.updateOne(
                    { deviceId: userData.deviceId },
                    userData
                )
                if (deviceCollection) {
                    console.log(device._id);
                    let userCollection = await user.findOne({
                        device: device._id
                    }).select("_id")
                    if (userCollection) {
                        resolve(userCollection)
                    }
                }
            }
            else {
                let deviceCollection = await Device.create(userData)
                if (deviceCollection) {
                    let geoRes = await geoLocation(userData.lat, userData.long)
                    const regCollection = await user.create({
                        device: deviceCollection._id,
                        geoLocation: geoRes,
                        timeStamp: new Date()
                    });
                    if (regCollection) {
                        console.log(regCollection);
                        resolve(regCollection._id)
                    }
                }
            }
        })
    },
    getcategory: () => {
        return new Promise(async (resolve, reject) => {
            let categoryCollection = await Category.find(
                {}
            ).catch((err) => {
                reject(err)
            })
            if (categoryCollection) {
                resolve(categoryCollection)
            }
            else {
                resolve({ data: "No category" })
            }
        })
    },
    // editsData:(data)=>{
    //     return new Promise(async(resolve,reject)=>{
    //         let data=await guidlineDoc.create({
    //             operationId: "626a4066807330c5db7e4174",
    //             documentName: "Memorandum of Association (MOA)",
    //             documentOptions: "Memorandum of Association (MOA)",
    //             businessName: "Public Limited Company",
    //             referral: "false",
    //             gst: "true",
    //             label: "Upload MOA of",
    //             imgUrl: "http://54.234.115.71:5000/icons/MOA.png",
    //         },
    //         // {
    //         //     $set:{
    //         //         // "imgUrlTelephoneBill":"http://54.234.115.71:5000/icons/telephone.png",
    //         //         // "imgUrlShopBoardWithAddress":"http://54.234.115.71:5000/icons/shopBoradWithaddress.jpg",
    //         //         // "imgUrlLetterHead":"http://54.234.115.71:5000/icons/cover-letter.png",
    //         //         // "imgUrlBankStatement":"http://54.234.115.71:5000/icons/bankStatement.jpg",
    //         //         "imgUrl":"http://54.234.115.71:5000/icons/aoa.jpg",
    //         //         "label":"Upload AOA of",


    //         //     }
    //         // }
    //         )
    //         console.log(data);
    //     })
    // }
}