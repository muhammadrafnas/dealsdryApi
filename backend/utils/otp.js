const { response } = require("express")
const { status } = require("express/lib/response")


const accountSid = process.env.TWILO_ACCOUNT_SID;
const authToken = process.env.TWILO_AUTHTOKEN;
const serviceSID = process.env.TWILO_SERVICE_SID;
const client = require("twilio")(accountSid, authToken)

let mobileNumber;
const verification = (mobile) => {
    return new Promise((resolve, reject) => {
        client.verify.services(serviceSID).verifications.create({
            to: `+91${mobile}`,
            channel: "sms"
        }).then((response) => {
            console.log("response");
            console.log(response);
            if(response){
                mobileNumber = mobile;
                resolve(true)
            }
            else
            {
                resolve(false)
            }
        }).catch(err => {
            console.log(err);
          reject(err)
        })

    })
}

const verificationCheck = (otp) => {
    return new Promise((resolve, reject) => {
        client.verify.services(serviceSID).verificationChecks.create({
            to: `+91${mobileNumber}`,
            code: otp
        }).then((response) => {
            console.log(response);
            if (response.valid) {
                resolve({ status: true, mobileNumber: mobileNumber })
            }
            else {
                resolve({ status: false })
            }
        }).catch(err => {
            throw new Error(err)
        })
    })
}

module.exports = {
    sendOtp: verification,
    verificationOtp: verificationCheck,
}

