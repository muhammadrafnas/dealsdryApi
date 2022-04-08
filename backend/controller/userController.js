const { reject } = require("bcrypt/promises")
const { user, business, businessDiffrent, whatsappSubscription } = require("../model/userModel")
const { docuemnt, documentGstNo } = require("../model/documentModel")
const bcrypt = require('bcrypt')

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
        }).catch(error => {
            console.log(error);
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
        })
    },
    emailPasswordRegistartion: (data) => {
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
        })
    },
    businessAddressShipping: (data, userId, addressProof) => {
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
                        business_billing_address_type: addressType,
                        business_contact_person_name: data.contactPersonName,
                        business_contact_person_mobile: data.contactPersonMobile,
                        buyer_business_address_proof_name: addressProof
                    }
                }
            })
            if (response) {
                resolve(response)
            }
        })
    },
    uploadDocumentGstYes: (panCard, addressProofFront, addressProofBack, businessProof, shippingAddreesProof, userId) => {
        return new Promise(async (resolve, reject) => {
            let data = await user.findByIdAndUpdate(userId, {
                "documents_gstYes_fseNo.pan_card": panCard,
                "documents_gstYes_fseNo.personal_address_proof_front_cop": addressProofFront,
                "documents_gstYes_fseNo. personal_address_proof_back_copy": addressProofBack,
                "documents_gstYes_fseNo.business_proof": businessProof,
                "documents_gstYes_fseNo.shipping_address_proof": shippingAddreesProof


            })
            if (data) {
                resolve(data)
            }
        })
    },
    uplodDocumentsGstNo: (panCard, addressProofFront, addressProofBack, businessProof, shippingAddreesProof, shopOwnerPhoto, shopBoardPhoto,userId) => {
        return new Promise(async (resolve, reject) => {
            let data = await user.findByIdAndUpdate(userId, {
                "documents_gstNo_fseYes.pan_card": panCard,
                "documents_gstNo_fseYes.personal_address_proof_front_cop": addressProofFront,
                " documents_gstNo_fseYes. personal_address_proof_back_copy": addressProofBack,
                " documents_gstNo_fseYes.business_proof": businessProof,
                " documents_gstNo_fseYes.shipping_address_proof": shippingAddreesProof,
                " documents_gstNo_fseYes.shop_owner_photo": shopOwnerPhoto,
                " documents_gstNo_fseYes.shop_board_photo": shopBoardPhoto

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
                business_type: userData.type
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
                email_verified: "success"
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
    getDocumentsGstNo: (userData) => {
        return new Promise(async (resolve, reject) => {
            let data = await documentGstNo.find({

            })
            if (data) {
                resolve(data)
            }
        })
    },
    getPendencyDocumentGstNo: (userID) => {
        return new Promise(async (resolve, reject) => {
            let data = await user.findOne({
                _id: userID
            })

        })
    }
}