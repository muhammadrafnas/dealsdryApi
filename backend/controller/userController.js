const { reject, promise } = require("bcrypt/promises")
const { user, business, businessDiffrent, whatsappSubscription } = require("../model/userModel")
const { docList, guidlineDoc } = require("../model/documentModel")
const bcrypt = require('bcrypt')
const { default: mongoose } = require("mongoose")

module.exports = {
  
    /*


        Controller file store the data and get data from the data base


    */
    
    checkPhone: (mobileNumber) => {
        return new Promise(async (resolve, reject) => {
            let exist = await user.find({
                mobile_number: mobileNumber
            })
            console.log(exist != null);
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
    mobileRegistration: (phoneNumber) => {
        return new Promise(async (resolve, reject) => {
            let data = await user.create({
                mobile_number: phoneNumber
            })
            if (data) {
                resolve(data)
            }
        }).catch((err) => {
            throw new Error(err)
        })
    },




    /*
        Email and password and referral is optional store to database

        Funcation calling from Registration router password storing becrypt format for security purpose

    */

    emailPasswordReferralRegistartion: (data) => {
        return new Promise(async (resolve, reject) => {
            data.password = await bcrypt.hash(data.password, 10)
            let userData = await user.updateOne({ _id: data.userId }, {
                $set: {
                    email: data.email, password: data.password, referral_id: data.referralCode
                }
            }
            ).catch((err) => {
                reject(err)
            })
            if (userData != null) {
                resolve({ status: true, data: userData })
            }
            else {
                resolve({ status: false })
            }
        }).catch((err) => {
            throw new Error(err)
        })
    },


    /*

    Email storing without refferal 

    */
    emailPasswordRegistartion: (data) => {
        console.log(data);
        return new Promise(async (resolve, reject) => {
            data.password = await bcrypt.hash(data.password, 10)
            let userData = await user.updateOne({ _id: data.userId }, {
                $set: {
                    email: data.email, password: data.password
                }
            }
            ).catch((err) => {
                reject(err)
            })
            if (userData != null) {
                resolve({ status: true, data: userData })
            }
            else {
                resolve({ status: false })
            }
        }).catch((err) => {
            throw new Error(err)
        })
    },


   /*
   @GST gst confirmation if gst yes call this funaction
   */

    gstinYes: (userData, proof) => {
        return new Promise(async (resolve, reject) => {
            let data = await user.findByIdAndUpdate(userData.userId, {
                "gstin_yes.gstin_number": userData.gstinNumber,
                "gstin_yes.gstin_document": proof
            }).catch((err) => {
                reject(err)
            })
            if (data) {
                resolve(data)
            }
            else{
                resolve()
            }
        })
    },
    gstNo: (userData, docuemnt) => {
        return new Promise(async (resolve, reject) => {
            let data = await user.findByIdAndUpdate(userData.userId, {
                "gstin_no.pan_number": userData.panNumber,
                "gstin_no.pancard_document": docuemnt
            }).catch((err) => {
                reject(err)
            })
            if (data) {
                resolve(data)
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
        })
    },


    /*
    @Business 
    get Business details from database
    */

    getBusinessDetials: () => {
        return new Promise(async (resolve, reject) => {
            let data = await business.find(
                {}
            ).catch((err) => {
                reject(err)
            })
            console.log(data);
            resolve(data)
        }).catch((err) => {
            reject(err)
        })
    },

    getBusinessDetialsDifferent: () => {
        return new Promise(async (resolve, reject) => {
            let data = await businessDiffrent.find({
            }).catch((err) => {
                reject(err)
            })
            if (data) {
                resolve(data)
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
        })
    },


     /*
    @Business 
    This is the post data .data store into database 
    after adding the data promise resolve eny error is found
    promise reject
    
    */

    postBusinessDetails: (userData, pancard) => {

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
        })
    },
    getGuidelinesDoc: (operationId, referral, gst, userId) => {
        return new Promise(async (resolve, reject) => {
            let documentsList = await guidlineDoc.find({
                operationId: operationId, referral: referral, gst: gst

            }).catch((err) => {
                reject(err)
            })
            let userName = await user.findOne({
                _id: userId
            }).select("business_details.businessAuthorizedName business_details.businessName gstin_no gstin_yes ")
            if (documentsList) {
                resolve({ guidelinesDoc: documentsList, userName: userName })
            }
            else {
                resolve()
            }
        })
    },
    businessAddress: (data, userId, addressProof) => {
        return new Promise(async (resolve, reject) => {
            let response = await user.findByIdAndUpdate(userId, {
                $push: {
                    business_billing_address: {
                        business_billing_address_pin_code: data.pinCode,
                        business_billing_address_town_area: data.townArea,
                        business_billing_address: data.billingAddress,
                        business_billing_address_landmark: data.landmark,
                        business_billing_address_city: data.city,
                        business_billing_address_state: data.state,
                        buyer_business_address_proof_name: addressProof,
                        business_billing_address_type: data.addressType,
                        business_contact_person_name: data.contactPersonName,
                        business_contact_person_mobile: data.contactPersonMobile,

                    }
                }

            }).catch((err) => {
                reject(err)
            })
            if (response) {
                resolve(response)
            }
        })
    },
    businessAddressShipping: (data, userId, shippingAddressProof) => {
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
        })
    },
    uploadDocuments: (docuemnt, docId, gst, referral, userId) => {
        return new Promise(async (resolve, reject) => {
            let data = await user.findByIdAndUpdate(userId, {
                "documents.docId": docId,
                "documents.pan_card": docuemnt.panCard,
                "documents.personal_address_proof_front_copy": docuemnt.addressProofFront,
                "documents.personal_address_proof_back_copy": docuemnt.addressProofBack,
                "documents.business_proof": docuemnt.businessProof,
                "documents.shipping_address_proof": docuemnt.shippingAddreesProof,
                "documents.shop_owner_photo": docuemnt.shopOwnerPhoto,
                "documents.shop_board_photo": docuemnt.shopBoardPhoto,
                "documents.firm_pancard": docuemnt.firmPancard,
                "documents.partnership_deed": docuemnt.partnershipDeed,
                "documents.certificate_incorporation": docuemnt.certificateIncorporation,
                "documents.memorandum_association": docuemnt.memorandumAssociation,
                "documents.articles_Association": docuemnt.ArticlesAssociation,
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
        })
    },
    getEmail: (userId) => {
        return new Promise(async (resolve, reject) => {
            let data = await user.findOne({
                _id: userId
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
        let doc=[]
        return new Promise(async (resolve, reject) => {
            let documents = await guidlineDoc.find({
                operationId: operationId
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
                if (!userData[0].doc.length == 0) {
                    for (let x of userData[0].doc) {
                        if (x.gst == gst && x.referral == referral) {
                            console.log(x);
                            let docname = Object.values(x.documentName).join("").replace(/ /g, "_")
                            if (Object.keys(userData[0].documents).includes(docname.toLowerCase()) == false) {
                                doc.push(x)
                            }
                        }
                    }
                    pendency.documents=doc
                }
                else {
                    pendency.docuemnt = documents
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
            }).select("business_details email mobile_number gstin_yes gstin_no,business_billing_address business_shipping_address")
            if (userData) {
                resolve(userData)
            }
            else {
                resolve()
            }
        })
    }
}