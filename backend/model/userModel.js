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
        gstin_number: String,
        gstin_document: String,
        gst_details:Object
    },
    device: { type: mongoose.Types.ObjectId, ref: "devices" },
    geoLocation: {
        type: String,
        default: ''
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
            business_billing_address_type: String,
            business_contact_person_name: String,
            business_contact_person_mobile: String,
        }
    ],
    business_shipping_address: [
        {
            business_shipping_address_pin_code: String,
            business_shipping_address_town_area: String,
            business_shipping_address: String,
            business_shipping_address_landmark: String,
            business_shipping_address_city: String,
            business_shipping_address_state: String,
            business_shipping_address_type: String,
            business_contact_person_name: String,
            business_contact_person_mobile: String,
            buyer_business_address_proof_name: String
        }
    ],
    documents: {
        pan_card: String,
        personal_address_proof_front_copy: String,
        personal_address_proof_back_copy: String,
        business_proof: String,
        shipping_address_proof: String,
        shop_owner_photo: String,
        shop_board_photo: String,
        firm_pancard: String,
        partnership_deed: String,
        certificate_incorporation: String,
        memorandum_association: String,
        articles_Association: String,
        docId: { type: mongoose.Types.ObjectId, ref: "typeOfOperations" },
        gst: String,
        referral: String
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
    },
    business_details: {
        businessName: {
            type: String
        },
        businessType: {
            type: String
        },
        businessAuthorizedName: {
            type: String
        },
        pancardNumber: {
            type: String
        },
        pancard: {
            type: String
        },
        contactPerson: {
            type: String
        },
        desigination: {
            type: String
        }
    },
    timeStamp: {
        type: Date,
        default: ''
    }
})


const business = mongoose.Schema({
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
    mobile_number: {
        type: Number
    }
})
const businessDetails = mongoose.model("businesses", business)
const businessDiffrent = mongoose.model("businessContact", businessDiffrentSchema)
const user = mongoose.model("users", userSchema)
const whatsappSub = mongoose.model("whatsappSubscription", whatsappsubscriptions)
module.exports = {
    user: user,
    business: businessDetails,
    businessDiffrent: businessDiffrent,
    whatsappSubscription: whatsappSub
}