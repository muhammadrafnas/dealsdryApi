const express = require("express")
const router = express.Router()
const { sendOtp, verificationOtp } = require("../utils/otp")
const userController = require("../controller/userController")
const { cloudinary } = require('../utils/cloudinary')
const { registrationEmail } = require("../controller/userController")
const nodemailer = require("nodemailer")
const { v4: uuidv4 } = require("uuid")
const bcrypt = require('bcrypt')

// send OTP api
router.post("/sendOtp", async (req, res) => {
   let phoneExist = await userController.checkPhone(req.body.phoneNumber)
   console.log(phoneExist);
   if (phoneExist.status) {
      res.json({ message: "Phone number verfication already done", userData: phoneExist.user })
   }
   else {
      let response = await sendOtp(req.body.phoneNumber)
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
      let user = await userController.doSignupPhone(response.phoneNumber)
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
// get email and password and refferal code
router.post("/email", async (req, res) => {
   let response = await userController.registrationEmail(req.body)
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
// GSTIN confirmation
router.post("/gstinYes", async (req, res) => {
   console.log(req.body);
   try {
      let fileStr = req.body.gstinProof;
      const uploadedResponse = await cloudinary.uploader.
         upload(fileStr)
      req.body.gstinProof = uploadedResponse.secure_url
   }
   catch (error) {
      console.error(error);
   }
   let data = await userController.registrationGstYes(req.body)
   if (data) {
      res.status(200).send({
         message: "Successfully added "
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
   console.log("heu");
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
router.get("/guidelinesDocuments", async (req, res) => {
   let documents = await userController.getDocuments()
   if (documents) {
      res.json(documents)
   }
})
//Business address for billing
router.post("/businessAddress", async (req, res) => {
   let response = await userController.businessAddress(req.body)
   if (response) {
      res.status(200).send({
         message: "Successfully added"
      })
   }
})
// business address for shipping
router.post("/businessAddressShipping", async (req, res) => {
   let response = await userController.businessAddressShipping(req.body)
   if (response) {
      res.status(200).send({
         message: "Successfully added"
      })
   }
})
// upload documents
router.post("/uploadDocuments", async (req, res) => {
   let docuemnt = await userController.uploadDocument(req.body)
   if (docuemnt) {
      res.status(200).send({
         message: "Successfully added"
      })
   }
})
//Registration With Pendency document
router.get("/pendencyDocument/:id", async (req, res) => {
   let response = await userController.getPendencyDocument(req.params.id)
   if (response) {
      res.json(response)
   }
})
// whatsapp subscription
router.get("/whatsappSubscription/:id", async (req, res) => {
   let response = await userController.whatsappSubscription(req.params.id)
   if (response) {
      res.status(200).send({
         message: "Whatsapp subscription successfully"
      })
   }
})
// email verfication
router.get("/emailVerification",async(req,res)=>{
   let response=await userController.getEmail(req.query.id)
   console.log(response.email);
   if(response){
      sendverficationEmail(response._id, response.email)
      res.status(200).send({
         message:"Verfication link send to your email "
      })
   }

})
// verfiy
router.get("/verify/:id/:uniqueString",(req,res)=>{
   console.log("raff");
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
router.get("/home",(req,res)=>{
   res.status(200).send({ 
      message:"Successfully enter to home screen"
   })
})







// ***********************************Nodemailer***************************************
let transporter = nodemailer.createTransport({
   service: "gmail",
   auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
   }
})

transporter.verify((error, success) => {
   if (error) {
        console.log(error);
   }
   else {
        console.log("Ready for message");
        console.log(success);
   }
})


const sendverficationEmail = ({ _id, email }, res) => {
   const currentUrl = "http://localhost:5000/user";
   const uniqueString = uuidv4() + _id;
   //mail options
   const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: res,
        subject: "Verfiy Your Email",
        html: `<p> Verfiy your email address  to complete the signup  and login  into your account</p><p>This link is <b>expires in 1 hours</b></p> <p>Press <a href=${currentUrl + "/verify/" + _id + "/" + uniqueString} >here</a><to proceed. </p>`
   }
   const  saltRounds=10;
   bcrypt.hash(
      uniqueString,saltRounds
   ).then((hashUniqueString)=>{
      console.log(hashUniqueString);
   }).catch(()=>{
      res.json({
         status:"Failed",
         message:"An error occured while hashing email data"
      })
   })

   transporter.sendMail(mailOptions).then(() => {
        console.log("success");
   }).catch((error) => {
        console.log(error);
   })
}

module.exports = router;