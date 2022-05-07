const express = require("express")
const router = express.Router()
const { sendOtp, verificationOtp } = require("../utils/otp")
const userController = require("../controller/userController")
const { sendverficationEmail } = require("../utils/nodeMailer")
const {gstDetailsGetfromApi,panDetailsGetfromApi}=require("../utils/zoopApi")
var fs = require('fs');
const fetch = require('node-fetch');
const dotenv = require("dotenv")
const upload = require("../utils/multer")
dotenv.config()


// send OTP api for mobile number verification
router.post("/otp", async (req, res, next) => {
   try {
      let phoneExist = await userController.checkPhone(req.body.mobileNumber)
      if (phoneExist.status) {
         res.json({ status: 1, data: { message: "Phone number verification already done", mobile_number_exists: "true" } })
      }
      else {
         let response = await sendOtp(req.body.mobileNumber)

         if (response) {
            res.status(200).json({
               status: 1,
               data: { message: "OTP send successfully ", mobile_number_exists: "false" }
            })
         }
         else {
            res.status(501).json({
               status: 0,
               data: { message: "Please check your mobile number" }
            })
         }
      }
   } catch (err) {
      next(err)
   }

})


// otp verfication api
router.post("/otp/verification", async (req, res, next) => {
   try {
      let response = await verificationOtp(req.body.otp)
      if (response.status) {
         let user = await userController.mobileRegistration(response.mobileNumber,req.body.userId)
         if (user) {
            res.json({ status: 1, data: { message: "Successfully verified mobile number" } })
         }
         else
         {
            res.json({
               status:0,
               data:{
                  message:"Wrong"
               }
            })
         }
      }
      else {
         res.status(501).json({
            status: 0, data: { message: "Enter valid OTP" }
         })
      }
   } catch (error) {
      next(error)
   }
})


// get email and password and refferal code api
router.post("/email/referral", async (req, res, next) => {
   try {
      let response = await userController.emailPasswordReferralRegistartion(req.body)
      if (response) {
         res.status(200).json({
            status: 1, data: {
               message: "Successfully added"
            }
         })
      }
      else {
         res.status(501).json({
            status: 0,
            data: { message: "Wrong" }
         })
      }
   } catch (error) {
      next(error)
   }

})

// Email api
router.post("/email", async (req, res, next) => {
   try {
      let response = await userController.emailPasswordRegistartion(req.body)
      if (response) {
         res.status(200).json({
            status: 1,
            data: { message: "Successfully added" }

         })
      }
      else {
         res.status(501).json({
            status: 0,
            data: {
               message: "Wrong"
            }
         })
      }
   } catch (error) {
      next(error)
   }

})


// GSTIN confirmations
router.post("/gstin", upload.single("proof"), async (req, res, next) => {
   try {
      if(req.body.gst=="true"){
         let gstDetails=await gstDetailsGetfromApi(req.body.gstinNumber)
         let data = await userController.gstinYes(req.body, req.file.filename,gstDetails)
         if (data.gst==false) {
            res.status(200).json({
               status: 1,
               data: { message: "Successfully added " }
            })
         }
         else if(data.gst==true){
            res.status(501).json({
               status: 0,
               data: { message: "Gst Exists" }
            })
         }
         else {
            res.status(501).json({
               status: 0,
               data: { message: "wrong" }
            })
         }
      }
      if(req.body.gst=="false"){
         let pandetails=await panDetailsGetfromApi(req.body.panNumber)
         console.log(pandetails);
         let response = await userController.gstNo(req.body,  req.file.filename,pandetails)
         if (response.pancard==false) {
            res.status(200).json({
               status: 1,
               data: {
                  message: "Successfully added"
               }
            })
         }
         else if(response.pancard==true){
            res.status(501).json({
               status: 0,
               data: { message: "Pancard Exists" }
            })
         }
         else {
            res.status(501).json({
               status: 0,
               data: { message: "worng" }
            })
         }
      }
   } catch (error) {
      console.log(error);
      next(error)
   }
})


// select category
router.post("/select/category", async (req, res, next) => {
   try {
      let response = await userController.registrationSelectCategory(req.body.category, req.body.userId)
      if (response) {
         res.status(200).json({
            status: 1,
            data: { message: "Successfully added " }
         })
      }
      else {
         res.status(501).json({
            status: 0,
            data: {
               message: "Wrong"
            }
         })
      }
   } catch (error) {
      next(error)
   }

})


// Business details get
router.get("/business/details", async (req, res, next) => {
   try {
      if (req.query.gstin == "true") {
            let data = await userController.getBusinessDetialsGst(req.query.userId)
            if (data) {
               res.status(200).json({
                  status: 1,
                  data:data.gstin_yes
               })
            }
            else {
               res.status(501).json({
                  status: 0,
                  data: {
                     message: "Wrong"
                  }
               })
            }
         }
         if (req.query.gstin == "false") {
            let data = await userController.getBusinessDetialsPanCard(req.query.userId)
            if (data) {
               res.status(200).json({
                  status: 1,
                  data:data.gstin_no
               })
            }
            else {
               res.status(501).json({
                  status: 0,
                  data: {
                     message: "Wrong"
                  }
               })
            }
         }
      
  

   } catch (error) {
      next(error)
   }
})

// Business details type 
router.get("/business/types", async (req, res, next) => {
   try {
      let typeOfOperations = await userController.getTypeOfOperation()
      if (typeOfOperations) {
         res.status(200).json(
            {
               status: 1,
               data: {
                  typeOfOperations
               }
            }
         )
      }
      else {
         res.status(501).json({
            status: 0,
            data: {
               message: "No type of operation"
            }
         })
      }
   } catch (error) {
      next(error)
   }
})


// Business details post api
router.post("/business/details", upload.single("pancard"), async (req, res, next) => {
   try {
      let data = await userController.postBusinessDetails(req.body,req.file ?  req.file.filename : null )
      if (data) {
         res.status(200).json({
            status: 1,
            data: {
               message: "Successfully added"
            }
         })
      }
      else {
         res.status(501).json({
            status: 0,
            data: {
               message: "Wrong"
            }
         })
      }
   } catch (error) {
      next(error)
   }
})


// Guidlines Documents 
router.get("/guidelines/doc", async (req, res, next) => {
   try {
      let guidelinesDoc = await userController.getGuidelinesDoc(req.query.operationId, req.query.referral, req.query.gst, req.query.userId)
      if (guidelinesDoc) {
         let count = guidelinesDoc.guidelinesDoc.length
         res.status(200).json({
            status: 1,
            data: {
               count,
               guidelinesDoc: guidelinesDoc.guidelinesDoc
            }
         })
      }
      else {
         res.status(501).json({
            status: 0,
            data: {
               message: "No Guidelines Documnets"
            }
         })
      }
   } catch (error) {
      next(error)
   }
})

//Business address for billing
router.post("/businessAddress/billing", upload.single("addressProof"), async (req, res, next) => {
   try {
      let response = await userController.businessAddress(req.body, req.body.userId, req.file ? req.file.filename : null )
      if (response) {
         res.status(200).json({
            status: 1,
            data: {
               message: "Successfully added"
            }
         })
      }
      else {
         res.status(501).json({
            status: 0,
            data: {
               message: "User not found"
            }
         })
      }
   } catch (error) {
      next(error)
   }

})


// Business address for shipping
router.post("/businessAddress/shipping", upload.single("shippingAddressProof"), async (req, res, next) => {
   try {
      let response = await userController.businessAddressShipping(req.body, req.body.userId, req.file ? req.file.filename : null)
      if (response) {
         res.status(200).json({
            status: 1,
            data: {
               message: "Successfully added"
            }
         })
      }
      else {
         res.status(501).json({
            status: 0,
            data: {
               message: "User not found"
            }
         })
      }
   } catch (error) {
      next(error)
   }
})


// pendency document
router.get("/pendency/detect", async (req, res, next) => {
   try {
      let pendency = await userController.getPendencyDocument(req.query.userId, req.query.gst, req.query.referral, req.query.operationId)
      if (pendency) {
         res.status(200).json({
            status: 1,
            data: {
               pendency
            }
         })
      }
      else {
         res.status(501).json({
            status: 0,
            data: {
               message: "Wrong"
            }
         })
      }
   } catch (error) {
      next(error)
   }
})

// Without pendency document
router.get("/withoutPendencyDocument", async (req, res, next) => {
   try {
      let data = await userController.getWithoutPendencyDocumnet(req.query.userId)
      if (data) {
         res.status(200).json({
            status: 1,
            data
         })
      }
      else {
         res.status(501).json({
            status: 0,
            message: "Wrong"
         })
      }
   } catch (error) {
      next(error)
   }

})
// Whatsapp subscription
router.get("/whatsappSubscription", async (req, res, next) => {
   try {
      let response = await userController.whatsappSubscription(req.query.userId, req.query.mobileNumber)
      if (response) {
         res.status(200).json({
            status: 1,
            data: {
               message: "Whatsapp subscription successfully"
            }
         })
      }
      else{
          res.status(501).json({
             status:1,
             data:{
                message:"Wrong"
             }
          })
      }
   } catch (error) {
      next(error)
   }
})


// Email verification
router.get("/email/verification", async (req, res, next) => {
   try {
      let response = await userController.getEmail(req.query.userId)
      if (response) {
         let email = await sendverficationEmail(response._id, response.email)
         res.status(200).json({
            status: 1,
            data: {
               link: email,
               message: "Verfication link send to your email "
            }
         })
      }
      else {
         res.status(501).json({
            status: 0,
            message: "Wrong"
         })
      }
   } catch (error) {
      next(error)
   }
})


// verfiy
router.get("/verify/:id/:uniqueString", async (req, res, next) => {
   try {
      let data = await userController.emailVerified(req.params.id)
      if (data) {
         res.status(200).send({
            message: "Email verified"
         })
      }
   } catch (error) {
      next(error)
   }

})


//get Business type
router.post("/business/type", async (req, res, next) => {
   try {
      let response = await userController.businessType(req.body)
      if (response) {
         res.status(200).json({
            status: 1,
            data: {
               message: "Successfully added"
            }
         })
      }
      else {
         res.status(501).json({
            status: 0,
            data: {
               message: "Wrong"
            }
         })
      }
   } catch (error) {
      next(error)
   }
})

// pincode api
router.get("/pincode", async (req, res, next) => {
   try {
      const pinCode = await fetch(process.env.GET_LOCATIONS + req.query.pincode)
      const [jsonPincodes] = await pinCode.json();
      const pins = jsonPincodes['PostOffice'].map(pins => ({
         town: pins.Name,
         pinCode
      }))
      const [SD] = jsonPincodes['PostOffice'];
      res.status(200).json({
         status: 1,
         data: {
            locations: pins, state: [SD.State], city: [SD.District]
         }
      })
   } catch (error) {
      next(error)
   }
})

// User info
router.get("/:userId/info", async (req, res, next) => {
   try {
      let data = await userController.userDataInfo(req.params.userId)
      if (data) {
         res.status(200).json({
            status: 1,
            data: {
               data
            }
         })
      }
      else {
         res.status(501).json({
            status: 0,
            data: {
               message: "Wrong"
            }
         })
      }
   } catch (error) {
      next(error)
   }

})

// reach to Home screen  as guest user .
router.get("/home", (req, res, next) => {
   try {
      res.status(200).json({
         status: 1,
         data: {
            message: "Successfully enter to home screen"
         }
      })
   } catch (error) {
      next(error)
   }

})

router.get("/referral", (req, res) => {
   let code = 12345678
   res.status(200).json({
      status: 1,
      code
   })
})


module.exports = router;