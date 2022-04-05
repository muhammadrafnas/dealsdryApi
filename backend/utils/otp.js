const { response } = require("express")
const { status } = require("express/lib/response")
const dotenv = require("dotenv")
dotenv.config()

const accountSid = process.env.TWILO_ACCOUNT_SID;
const authToken = process.env.TWILO_AUTHTOKEN;
const serviceSID = process.env.TWILO_SERVICE_SID;
const client = require("twilio")(accountSid, authToken)

let phoneNumber;
const verification = (phone) => {
    console.log(phone);
    return new Promise((resolve, reject) => {
        client.verify.services(serviceSID).verifications.create({
            to: `+91${phone}`,
            channel: "sms"
        }).then((response) => {

            phoneNumber = phone;
            console.log(phoneNumber);
            resolve(true)
        }).catch(err => {
            console.log(err);
        })

    })
}

const verificationCheck = (otp) => {
    console.log(otp);
    console.log(phoneNumber);
    return new Promise((resolve, reject) => {
        client.verify.services(serviceSID).verificationChecks.create({
            to: `+91${phoneNumber}`,
            code: otp
        }).then((response) => {
            console.log(response);
            if (response.valid) {
                resolve({ status: true, phoneNumber: phoneNumber })
            }
            else {
                resolve({ status: false })
            }
        }).catch(err => {
            console.log(err);
        })
    })
}

module.exports = {
    sendOtp: verification,
    verificationOtp: verificationCheck,
}

