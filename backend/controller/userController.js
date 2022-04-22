const { reject } = require("bcrypt/promises")
const { user, business, businessDiffrent, whatsappSubscription } = require("../model/userModel")
const { docuemnt, documentGstNo, partnerShipDoc,privatePublicSpcDoc } = require("../model/documentModel")
const bcrypt = require('bcrypt')
const { default: mongoose } = require("mongoose")

module.exports = {
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
            throw new Error(err)
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
    emailPasswordReferralRegistartion: (data) => {
        console.log(data);
        return new Promise(async (resolve, reject) => {
            data.password = await bcrypt.hash(data.password, 10)
            let userData = await user.updateOne({ _id: data.userId }, {
                $set: {
                    email: data.email, password: data.password, referral_id: data.referralCode
                }
            }
            )
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
    emailPasswordRegistartion: (data) => {
        console.log(data);
        return new Promise(async (resolve, reject) => {
            data.password = await bcrypt.hash(data.password, 10)
            let userData = await user.updateOne({ _id: data.userId }, {
                $set: {
                    email: data.email, password: data.password
                }
            }
            )
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
    gstinYes: (userData, proof) => {
        return new Promise(async (resolve, reject) => {
            let data = await user.findByIdAndUpdate(userData.userId, {

                "gstin_yes.gstin_number": userData.gstinNumber,
                "gstin_yes.gstin_document": proof

            })
            if (data) {
                resolve(data)
            }
        }).catch((err) => {
            throw new Error(err)
        })
    },
    gstNo: (userData, docuemnt) => {
        return new Promise(async (resolve, reject) => {
            let data = await user.findByIdAndUpdate(userData.userId, {
                "gstin_no.pan_number": userData.panNumber,
                "gstin_no.pancard_document": docuemnt
            })
            if (data) {
                resolve(data)
            }
        }).catch((err) => {
            throw new Error(err)
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
        }).catch((err) => {
            throw new Error(err)
        })
    },
    getBusinessDetials: () => {
        return new Promise(async (resolve, reject) => {
            let data = await business.find(
                {}
            )
            console.log(data);
            resolve(data)
        }).catch((err) => {
            throw new Error(err)
        })
    },
    getBusinessDetialsDifferent: () => {
        return new Promise(async (resolve, reject) => {
            let data = await businessDiffrent.find({
            })
            if (data) {
                resolve(data)
            }
        }).catch((err) => {
            throw new Error(err)
        })
    },
    getDocuments: () => {
        return new Promise(async (resolve, reject) => {
            let data = await docuemnt.find({
            })
            if (data) {
                resolve(data)
            }
        }).catch((err) => {
            throw new Error(err)
        })
    },
    getDocumentsGstNo: (userData) => {
        return new Promise(async (resolve, reject) => {
            let data = await documentGstNo.find({

            })
            if (data) {
                resolve(data)
            }
        }).catch((err) => {
            throw new Error(err)
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
                        business_billing_address_type: data.addressType
                    }
                }

            })
            if (response) {
                resolve(response)
            }
        }).catch((err) => {
            throw new Error(err)
        })
    },
    businessAddressShipping: (data, userId, shippingAddressProof) => {
        return new Promise(async (resolve, reject) => {
            let response = await user.findByIdAndUpdate(userId, {
                $push:
                {
                    business_shipping_address: {
                        business_billing_address_pin_code: data.pinCode,
                        business_billing_address_town_area: data.townArea,
                        business_billing_address: data.billingAddress,
                        business_billing_address_landmark: data.landmark,
                        business_billing_address_city: data.city,
                        business_billing_address_state: data.state,
                        business_billing_address_type: data.addressType,
                        business_contact_person_name: data.contactPersonName,
                        business_contact_person_mobile: data.contactPersonMobile,
                        buyer_business_address_proof_name: shippingAddressProof
                    }
                }
            })
            if (response) {
                resolve(response)
            }
        }).catch((err) => {
            throw new Error(err)
        })
    },
    uploadDocumentGstYes: (panCard, addressProofFront, addressProofBack, businessProof, shippingAddreesProof, userId) => {
        return new Promise(async (resolve, reject) => {
            let data = await user.findByIdAndUpdate(userId, {
                "documents_gstYes.pan_card": panCard,
                "documents_gstYes.personal_address_proof_front_copy": addressProofFront,
                "documents_gstYes.personal_address_proof_back_copy": addressProofBack,
                "documents_gstYes.business_proof": businessProof,
                "documents_gstYes.shipping_address_proof": shippingAddreesProof


            })
            if (data) {
                resolve(data)
            }
        }).catch((err) => {
            throw new Error(err)
        })
    },
    uplodDocumentsGstNo: (panCard, addressProofFront, addressProofBack, businessProof, shippingAddreesProof, shopOwnerPhoto, shopBoardPhoto, userId) => {
        console.log(userId);
        return new Promise(async (resolve, reject) => {
            let data = await user.findByIdAndUpdate(userId, {
                "documents_gstNo.pan_card": panCard,
                "documents_gstNo.personal_address_proof_front_copy": addressProofFront,
                "documents_gstNo.personal_address_proof_back_copy": addressProofBack,
                "documents_gstNo.business_proof": businessProof,
                "documents_gstNo.shipping_address_proof": shippingAddreesProof,
                "documents_gstNo.shop_owner_photo": shopOwnerPhoto,
                "documents_gstNo.shop_board_photo": shopBoardPhoto

            })
            if (data) {
                resolve(data)
            }
        }).catch((err) => {
            throw new Error(err)
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
        }).catch((err) => {
            throw new Error(err)
        })
    },
    businessType: (userData) => {
        console.log(userData);
        return new Promise(async (resolve, reject) => {
            let data = await user.findByIdAndUpdate(userData.userId, {
                business_type: userData.type
            })
            if (data) {
                resolve(data)
            }
        }).catch((err) => {
            throw new Error(err)
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
        }).catch((err) => {
            throw new Error(err)
        })
    },
    emailVerified: (userId) => {
        return new Promise(async (resolve, reject) => {
            let data = await user.findByIdAndUpdate(userId, {
                email_verified: "success"
            })
            if (data) {
                resolve(data)
            }
        }).catch((err) => {
            throw new Error(err)
        })
    },
    getPendencyDocumentGstYes: (userID) => {
        console.log(userID);
        userID = mongoose.Types.ObjectId(userID)
        return new Promise(async (resolve, reject) => {
            let whatsappSubscription = await user.aggregate([
                { $match: { _id: userID } },
                {
                    $lookup: {
                        from: "whatsappsubscriptions",
                        localField: "_id",
                        foreignField: "userId",
                        as: "whatsappSub"
                    }
                }
            ])
            let pendencyDocumentGstYes = {}
            if (whatsappSubscription) {
                if (whatsappSubscription[0].whatsappSub.length == 0) {
                    pendencyDocumentGstYes.whatsapp = " Whatsapp Not subscribed"
                }
                if (!whatsappSubscription[0].email_verified) {
                    pendencyDocumentGstYes.email = "Email not verfied"
                }
                if (whatsappSubscription[0].documents_gstYes) {
                    if (!whatsappSubscription[0].documents_gstYes.hasOwnProperty('pan_card')) {
                        pendencyDocumentGstYes.panCard = "Pan card Not uploaded"
                    }
                    if (!whatsappSubscription[0].documents_gstYes.hasOwnProperty('personal_address_proof_front_copy')) {
                        pendencyDocumentGstYes.personalAddressProofFront = "Not uploaded"
                    }
                    if (!whatsappSubscription[0].documents_gstYes.hasOwnProperty('personal_address_proof_back_copy')) {
                        pendencyDocumentGstYes.pesonalAddressProofBack = "Not uploaded"
                    }
                    if (!whatsappSubscription[0].documents_gstYes.hasOwnProperty('business_proof')) {
                        pendencyDocumentGstYes.businessProof = "Not uploaded"
                    }
                    if (!whatsappSubscription[0].documents_gstYes.hasOwnProperty('shipping_address_proof')) {
                        pendencyDocumentGstYes.shppingAddressProof = "Not uploaded"
                    }
                }
                else {
                    pendencyDocumentGstYes.docuemnt = "All document upload pending"
                }
                resolve(pendencyDocumentGstYes)

            }

        }).catch((err) => {
            throw new Error(err)
        })
    },
    getPendencyDocumentGstNo: (userID) => {
        userID = mongoose.Types.ObjectId(userID)
        return new Promise(async (resolve, reject) => {
            let whatsappSubscription = await user.aggregate([
                { $match: { _id: userID } },
                {
                    $lookup: {
                        from: "whatsappsubscriptions",
                        localField: "_id",
                        foreignField: "userId",
                        as: "whatsappSub"
                    }
                }
            ])
            let pendencyDocumentGstNo = {}
            if (whatsappSubscription) {
                if (whatsappSubscription[0].whatsappSub.length == 0) {
                    pendencyDocumentGstNo.whatsapp = " Whatsapp Not subscribed"
                }
                if (!whatsappSubscription[0].email_verified) {
                    pendencyDocumentGstNo.email = "Email not verfied"
                }
                if (whatsappSubscription[0].documents_gstNo) {
                    if (!whatsappSubscription[0].documents_gstNo.hasOwnProperty('pan_card')) {
                        pendencyDocumentGstNo.panCard = "Pan card Not uploaded"
                    }
                    if (!whatsappSubscription[0].documents_gstNo.hasOwnProperty('personal_address_proof_front_copy')) {
                        pendencyDocumentGstNo.personalAddressProofFront = "Not uploaded"
                    }
                    if (!whatsappSubscription[0].documents_gstNo.hasOwnProperty('personal_address_proof_back_copy')) {
                        pendencyDocumentGstNo.pesonalAddressProofBack = "Not uploaded"
                    }
                    if (!whatsappSubscription[0].documents_gstNo.hasOwnProperty('business_proof')) {
                        pendencyDocumentGstNo.businessProof = "Not uploaded"
                    }
                    if (!whatsappSubscription[0].documents_gstNo.hasOwnProperty('shipping_address_proof')) {
                        pendencyDocumentGstNo.shppingAddressProof = "Not uploaded"
                    }
                    if (!whatsappSubscription[0].documents_gstNo.hasOwnProperty('shop_owner_photo')) {
                        pendencyDocumentGstNo.shopOwnerPhoto = "Not uploaded"
                    }
                    if (!whatsappSubscription[0].documents_gstNo.hasOwnProperty('shop_board_photo')) {
                        pendencyDocumentGstNo.shopBoardphoto = "Not uploaded"
                    }
                }
                else {
                    pendencyDocumentGstNo.docuemnt = "All document upload pending"
                }
                resolve(pendencyDocumentGstNo)

            }
        }).catch((err) => {
            throw new Error(err)
        })
    },
    getPendencyDocumentPartnershipAndLlp: (userID) => {
        userID = mongoose.Types.ObjectId(userID)
        return new Promise(async (resolve, reject) => {
            let whatsappSubscription = await user.aggregate([
                { $match: { _id: userID } },
                {
                    $lookup: {
                        from: "whatsappsubscriptions",
                        localField: "_id",
                        foreignField: "userId",
                        as: "whatsappSub"
                    }
                }
            ])
            let pendencyDocumentGstNo = {}
            if (whatsappSubscription) {
                if (whatsappSubscription[0].whatsappSub.length == 0) {
                    pendencyDocumentGstNo.whatsapp = " Whatsapp Not subscribed"
                }
                if (!whatsappSubscription[0].email_verified) {
                    pendencyDocumentGstNo.email = "Email not verfied"
                }
                if (whatsappSubscription[0].documents_partnership) {
                    if (!whatsappSubscription[0].documents_partnership.hasOwnProperty('pan_card')) {
                        pendencyDocumentGstNo.panCard = "Pan card Not uploaded"
                    }
                    if (!whatsappSubscription[0].documents_partnership.hasOwnProperty('personal_address_proof_front_copy')) {
                        pendencyDocumentGstNo.personalAddressProofFront = "Not uploaded"
                    }
                    if (!whatsappSubscription[0].documents_partnership.hasOwnProperty('personal_address_proof_back_copy')) {
                        pendencyDocumentGstNo.pesonalAddressProofBack = "Not uploaded"
                    }
                    if (!whatsappSubscription[0].documents_partnership.hasOwnProperty('business_proof')) {
                        pendencyDocumentGstNo.businessProof = "Not uploaded"
                    }
                    if (!whatsappSubscription[0].documents_partnership.hasOwnProperty('shipping_address_proof')) {
                        pendencyDocumentGstNo.shppingAddressProof = "Not uploaded"
                    }
                    if (!whatsappSubscription[0].documents_partnership.hasOwnProperty('firm_pancard')) {
                        pendencyDocumentGstNo.firmPancard = "Not uploaded"
                    }
                    if (!whatsappSubscription[0].documents_partnership.hasOwnProperty('partnership_deed')) {
                        pendencyDocumentGstNo.partnershipDeed = "Not uploaded"
                    }
                }
                else {
                    pendencyDocumentGstNo.docuemnt = "All document upload pending"
                }
                resolve(pendencyDocumentGstNo)

            }
        }).catch((err) => {
            throw new Error(err)
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
            ])
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
            throw new Error(err)
        })
    },
    uplodDocuments: (panCard, addressProofFront, addressProofBack, businessProof, shippingAddreesProof, firmPancard, partnershipDeed, userId) => {
        console.log(userId);
        return new Promise(async (resolve, reject) => {
            let data = await user.findByIdAndUpdate(userId, {
                "documents_partnership.pan_card": panCard,
                "documents_partnership.personal_address_proof_front_copy": addressProofFront,
                "documents_partnership.personal_address_proof_back_copy": addressProofBack,
                "documents_partnership.business_proof": businessProof,
                "documents_partnership.shipping_address_proof": shippingAddreesProof,
                "documents_partnership.firm_pancard": firmPancard,
                "documents_partnership.partnership_deed": partnershipDeed

            })
            if (data) {
                resolve(data)
            }
        }).catch((err) => {
            throw new Error(err)
        })
    },
    getDocumentsPartnershipAndLlp: () => {
        return new Promise(async (resolve, reject) => {
            let data = await partnerShipDoc.find({

            })
            if (data) {
                resolve(data)
            }
        }).catch((err) => {
            throw new Error(err)
        })
    },
    getDocumnetPrivateLimited: () => {
        
        return new Promise(async (resolve, reject) => {
            let documnetsList = await privatePublicSpcDoc.find({
            })
            if (documnetsList) {
                resolve(documnetsList)
            }
            else {
                resolve({ data: "No data found" })
            }
        })
    },
    uploadDocumnetPrivateLimited: (companyPancard, panCard, addressProofFront, addressProofBack, businessProof, shippingAddreesProof, certificateIncorporation, memorandumAssociation, ArticlesAssociation, userId) => {
        console.log(memorandumAssociation);
        return new Promise(async (resolve, reject) => {
            let data = await user.findByIdAndUpdate(userId, {
                "documents_private_limited.company_pancard": companyPancard,
                "documents_private_limited.pan_card": panCard,
                "documents_private_limited.personal_address_proof_front_copy": addressProofFront,
                "documents_private_limited.personal_address_proof_back_copy": addressProofBack,
                "documents_private_limited.business_proof": businessProof,
                "documents_private_limited.shipping_address_proof": shippingAddreesProof,
                "documents_private_limited.certificate_incorporation": certificateIncorporation,
                "documents_private_limited.memorandum_association": memorandumAssociation,
                "documents_private_limited.articles_Association": ArticlesAssociation
            })
            if (data) {
                resolve(data)
            }
        }).catch((err) => {
            throw new Error(err)
        })
    },
    getPendencyDocumentPrivateLimited: (userID) => {
        userID = mongoose.Types.ObjectId(userID)
        return new Promise(async (resolve, reject) => {
            let whatsappSubscription = await user.aggregate([
                { $match: { _id: userID } },
                {
                    $lookup: {
                        from: "whatsappsubscriptions",
                        localField: "_id",
                        foreignField: "userId",
                        as: "whatsappSub"
                    }
                }
            ])
            let pendencyDocument = {}
            if (whatsappSubscription) {
                if (whatsappSubscription[0].whatsappSub.length == 0) {
                    pendencyDocument.whatsapp = " Whatsapp Not subscribed"
                }
                if (!whatsappSubscription[0].email_verified) {
                    pendencyDocument.email = "Email not verfied"
                }
                if (whatsappSubscription[0].documents_private_limited) {
                    if (!whatsappSubscription[0].documents_private_limited.hasOwnProperty('company_pancard')) {
                        pendencyDocument.panCard = "Company card Not uploaded"
                    }
                    if (!whatsappSubscription[0].documents_private_limited.hasOwnProperty('pan_card')) {
                        pendencyDocument.panCard = "Pan card Not uploaded"
                    }
                    if (!whatsappSubscription[0].documents_private_limited.hasOwnProperty('personal_address_proof_front_copy')) {
                        pendencyDocument.personalAddressProofFront = "Not uploaded"
                    }
                    if (!whatsappSubscription[0].documents_private_limited.hasOwnProperty('personal_address_proof_back_copy')) {
                        pendencyDocument.pesonalAddressProofBack = "Not uploaded"
                    }
                    if (!whatsappSubscription[0].documents_private_limited.hasOwnProperty('business_proof')) {
                        pendencyDocument.businessProof = "Not uploaded"
                    }
                    if (!whatsappSubscription[0].documents_private_limited.hasOwnProperty('shipping_address_proof')) {
                        pendencyDocument.shppingAddressProof = "Not uploaded"
                    }
                    if (!whatsappSubscription[0].documents_private_limited.hasOwnProperty('certificate_incorporation')) {
                        pendencyDocument.certificateIncorporation = "Certificate of incorporation not uploaded"
                    }
                    if (!whatsappSubscription[0].documents_private_limited.hasOwnProperty('memorandum_association')) {
                        pendencyDocument.memorandumAssociation = "memorandum of association Not uploaded"
                    }
                    if (!whatsappSubscription[0].documents_private_limited.hasOwnProperty('articles_Association')) {
                        pendencyDocument.articlesAssociation = "articles of AssociationNot uploaded"
                    }
                }
                else {
                    pendencyDocument.docuemnt = "All document upload pending"
                }
                resolve(pendencyDocument)

            }
        }).catch((err) => {
            throw new Error(err)
        })
    }
}