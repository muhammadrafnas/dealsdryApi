const mongoose = require("mongoose")
//user schema 
const userSchema = mongoose.Schema({
    mobile_number: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    referral_id: {
        type: Number
    },
    gstin_yes:
    {
        gstin_number: Number,
        gstin_document: String
    }
    ,
    category: {
        type: Array
    },
    business_billing_address: [
        {
            business_billing_address_pin_code: Number,
            business_billing_address_town_area: String,
            business_billing_address: String,
            business_billing_address_landmark: String,
            business_billing_address_city: String,
            business_billing_address_state: String,
            buyer_business_address_proof_name: String,
            business_billing_address_type: String

        }
    ],
    business_shipping_address: [
        {
            business_billing_address_pin_code: String,
            business_billing_address_town_area: String,
            business_billing_address: String,
            business_billing_address_landmark: String,
            business_billing_address_city: String,
            business_billing_address_state: String,
            business_billing_address_type: String,
            business_contact_person_name: String,
            business_contact_person_mobile: String,
            buyer_business_address_proof_name:String
        }
    ],
    documents_gstYes: {
        pan_card: String,
        personal_address_proof_front_copy: String,
        personal_address_proof_back_copy: String,
        business_proof: String,
        shipping_address_proof: String

    },
    business_type: {
        type: String
    },
    email_verified: {
        type: String
    },
    gstin_no:
    {
        pan_number: String,
        pancard_document: String
    }

    ,
    documents_gstNo: {
        pan_card: String,
        personal_address_proof_front_copy: String,
        personal_address_proof_back_copy: String,
        business_proof: String,
        shipping_address_proof: String,
        shop_owner_photo: String,
        shop_board_photo: String
    },
    documents_partnership: {
        pan_card: String,
        personal_address_proof_front_copy: String,
        personal_address_proof_back_copy: String,
        business_proof: String,
        shipping_address_proof: String,
        firm_pancard: String,
        partnership_deed: String
    },
    documents_private_limited:{
        company_pancard:String,
        pan_card: String,
        personal_address_proof_front_copy: String,
        personal_address_proof_back_copy: String,
        business_proof: String,
        shipping_address_proof: String,
        certificate_incorporation:String,
        memorandum_association:String,
        articles_Association :String
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
const whatsappsubscriptions = mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: "users" },
    phoneNumber: {
        type: Number
    }
})
const business = mongoose.model("business", businessSchema)
const businessDiffrent = mongoose.model("businessContact", businessDiffrentSchema)
const user = mongoose.model("users", userSchema)
const whatsappSub = mongoose.model("whatsappSubscription", whatsappsubscriptions)
module.exports = {
    user: user,
    business: business,
    businessDiffrent: businessDiffrent,
    whatsappSubscription: whatsappSub
}