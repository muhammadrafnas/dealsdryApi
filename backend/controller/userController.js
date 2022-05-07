const { reject, promise } = require("bcrypt/promises")
const { user, business, businessDiffrent, whatsappSubscription } = require("../model/userModel")
const { docList, guidlineDoc } = require("../model/documentModel")
const Category = require("../model/categoryModel")
const { Device } = require("../model/deviceModel")
const bcrypt = require('bcrypt')
const { geoLocation } = require("../utils/geoLocation")
const { default: mongoose } = require("mongoose")
const { resolve } = require("path")

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
    gstNo: (userData, docuemnt, panDetails) => {
        return new Promise(async (resolve, reject) => {
            let pancardExist = await user.findOne({ "gstin_no.pan_number": userData.panNumber })
            if (pancardExist) {
                resolve({ pancard: true })
            }
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
        return new Promise(async (resolve, reject) => {
            let data = await user.findOne(
                { _id: userId }
            ).select("gstin_yes.gst_details.legal_name gstin_yes.gst_details.type_Of_operation gstin_yes.gstin_number gstin_yes.gstin_document ").catch((err) => {
                reject(err)
            })
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
            let documentsList = await guidlineDoc.find({
                operationId: operationId, referral: referral, gst: gst

            }).catch((err) => {
                reject(err)
            })
            let userDetails = await user.findOne({
                _id: userId
            }).select("business_details.businessAuthorizedName business_details.businessName gstin_no gstin_yes ")
            if (documentsList) {
                if (userDetails.gstin_no.pancard_document) {
                    for (let x of documentsList) {
                        if (x.documentName == "PAN Card") {
                            x.label = "PAN Card"
                            x._doc.docurl = userDetails.gstin_no.pancard_document
                        }
                        if (x.documentName == "PAN Card" || x.documentName == "Personal Address proof front copy" || x.documentName == "Personal Address proof back copy" || x.documentName == "Business proof" || x.documentName == "Shipping Address proof") {
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
                        }
                        if (x.documentName == "Shipping Address proof") {
                            x.label = "Shipping Address proof"
                            x._doc.docurl = userDetails.gstin_yes.gstin_document
                        }
                        if (x.documentName == "PAN Card" || x.documentName == "Personal Address proof front copy" || x.documentName == "Personal Address proof back copy" || x.documentName == "Business proof" || x.documentName == "Shipping Address proof") {
                            x._doc.ownerName = userDetails.business_details.businessAuthorizedName
                        }
                        else {
                            x._doc.ownerName = userDetails.business_details.businessName
                        }
                    }
                }
                resolve({ guidelinesDoc: documentsList })
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
                    pendency.documents = doc
                }
                else {
                    pendency.documents = documents
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
            }).select("business_details email mobile_number gstin_yes gstin_no business_billing_address business_shipping_address")
            if (userData) {
                resolve(userData)
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
    }
}