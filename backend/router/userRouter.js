const express = require("express")
const router = express.Router()
const { sendOtp, verificationOtp } = require("../utils/otp")
const userController = require("../controller/userController")
const { sendverficationEmail } = require("../utils/nodeMailer")


// send OTP api for mobile number verification
router.post("/sendOtp", async (req, res) => {
   let phoneExist = await userController.checkPhone(req.body.mobileNumber)
   console.log(phoneExist);
   if (phoneExist.status) {
      res.json({ message: "Phone number verfication already done", userData: phoneExist.user })
   }
   else {
      let response = await sendOtp(req.body.mobileNumber)
      if (response) {
         res.status(200).send({
            message: "OTP send successfully "
         })
      }
      else {
         res.status(501).send({
            message: "Please check your mobile number"
         })
      }
   }
})


// otp verfication api
router.post("/otpVerification", async (req, res) => {
   let response = await verificationOtp(req.body.otp)
   if (response.status) {
      let user = await userController.mobileRegistration(response.mobileNumber)
      if (user) {
         res.json({ message: "Successfully verified mobile number", userDetails: user })
      }
   }
   else {
      res.status(501).send({
         message: "Enter valid OTP"
      })
   }
})


// get email and password and refferal code api
router.post("/emailwithReferral", async (req, res) => {
   let response = await userController.emailPasswordReferralRegistartion(req.body)
   if (response.status) {
      res.status(200).send({
         message: "Successfully added email and password"
      })
   }
   else {
      res.status(501).send({
         message: "Somthing wrong!"
      })
   }
})


router.post("/emailWithoutRefferal", async (req, res) => {
   let response = await userController.registrationEmailGstNo(req.body)
   if (response) {
      res.status(200).send({
         message: "Successfully added email and password "
      })
   }
})


// GSTIN confirmation
router.post("/gstinYes", async (req, res) => {
   let data = await userController.gstinYes(req.body, req.files.gstinDocument.name)
   if (data) {
      res.status(200).send({
         message: "Successfully added "
      })
   }
})


//gst no 
router.post("/gstinNo", async (req, res) => {
   let response = await userController.gstNo(req.body, req.files.pancard.name)
   if (response) {
      res.status(200).send({
         message: "Successfully added"
      })
   }
})


// select category
router.post("/selectCategory", async (req, res) => {
   let response = await userController.registrationSelectCategory(req.body.category, req.body.userId)
   if (response) {
      res.status(200).send({
         message: "Successfully added "
      })
   }
})


// Business details
router.get("/businessDetails", async (req, res) => {
   let businessDetails = await userController.getBusinessDetials()
   if (businessDetails) {
      res.json(businessDetails)
   }
})


// Business details contact perosn is diffrent
router.get("/businessDetailsDiffrent", async (req, res) => {
   let businessDetails = await userController.getBusinessDetialsDiffrent()
   if (businessDetails) {
      res.json(businessDetails)
   }
})


//List and guidlines
router.get("/guidelinesDocumentsGstYes", async (req, res) => {
   let documents = await userController.getDocuments()
   if (documents) {
      res.json(documents)
   }
})


//list and guidline
router.get("/guidelinesDocumentsGstNo", async (req, res) => {
   let data = await userController.getDocumentsGstNo()
   if (data) {
      res.json(data)
   }
})


//Business address for billing
router.post("/businessAddressBilling", async (req, res) => {
   console.log(req.body);
   let response = await userController.businessAddress(req.body, req.body.userId, req.files.addressProof.name)
   if (response) {
      res.status(200).send({
         message: "Successfully added"
      })
   }
})


// business address for shipping
router.post("/businessAddressShipping", async (req, res) => {
   let response = await userController.businessAddressShipping(req.body, req.body.userId)
   if (response) {
      res.status(200).send({
         message: "Successfully added"
      })
   }
})


// upload documents gst Yes
router.post("/uploadDocumentsGstYes", async (req, res) => {
   let docuemnt = await userController.uploadDocumentGstYes(req.files.panCard.name, req.files.addressProofFront.name, req.files.addressProofBack.name, req.files.businessProof.name, req.files.shippingAddreesProof.name, req.files.shopOwnerPhoto.name, req.files.shopBoardPhoto.name, req.body.userId)
   if (docuemnt) {
      res.status(200).send({
         message: "Successfully added"
      })
   }
})
// upload documents gstNo
router.post("/uploadDocumentsGstNo", async (req, res) => {
   let data = await userController.uplodDocumentsGstNo(req.files.panCard.name, req.files.addressProofFront.name, req.files.addressProofBack.name, req.files.businessProof.name, req.files.shippingAddreesProof.name, req.body.userId)
   if (data) {
      res.status(200).send({
         message: "Successfully added"
      })
   }
})


//Registration With Pendency document
router.get("/pendencyDocument", async (req, res) => {
   let response = await userController.getPendencyDocument(req.query.id)
   if (response) {
      res.json(response)
   }
})


// whatsapp subscription
router.get("/whatsappSubscription", async (req, res) => {
   let response = await userController.whatsappSubscription(req.query.userId)
   if (response) {
      res.status(200).send({
         message: "Whatsapp subscription successfully"
      })
   }
})


// email verfication
router.get("/emailVerification", async (req, res) => {
   console.log("call api...");
   let response = await userController.getEmail(req.query.userId)
   console.log(response.email);
   if (response) {
      let email = sendverficationEmail(response._id, response.email)
      res.status(200).send({
         message: "Verfication link send to your email "
      })
   }

})


// verfiy
router.get("/verify/:id/:uniqueString", async (req, res) => {
   let data = await userController.emailVerified(req.params.id)
   if (data) {
      res.status(200).send({
         message: "Email verified"
      })
   }
})


//get business type
router.get("/businessType", async (req, res) => {
   let response = await userController.businessType(req.body)
   if (response) {
      res.status(200).send({
         message: "Successfully added"
      })
   }
})



// reach to home screen as a guest
router.get("/home", (req, res) => {
   res.status(200).send({
      message: "Successfully enter to home screen"
   })
})



// pendency document gstNo
router.get("/pendencyDocument", async (req, res) => {
   let data = await userController.getPendencyDocumentGstNo(req.query.userId)
   if (data) {
      res.json(data)
   }
})
module.exports = router;