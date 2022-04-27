const express = require("express")
const router = express.Router()
const { sendOtp, verificationOtp } = require("../utils/otp")
const userController = require("../controller/userController")
const { sendverficationEmail } = require("../utils/nodeMailer")
const { route } = require("express/lib/application")
var pincodeDirectory = require('india-pincode-lookup');


// send OTP api for mobile number verification
router.post("/otp", async (req, res, next) => {
   console.log(req.body);
   try {
      let phoneExist = await userController.checkPhone(req.body.mobileNumber)
      if (phoneExist.status) {
         res.json({ status: 1, data: { message: "Phone number verification already done", userData: phoneExist.user, mobile_number_exists: "true" } })
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
         let user = await userController.mobileRegistration(response.mobileNumber)
         if (user) {
            res.json({ status: 1, data: { message: "Successfully verified mobile number", user } })
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
   console.log("api....");
   try {
      let response = await userController.emailPasswordReferralRegistartion(req.body)
      if (response.status) {
         res.status(200).json({
            status: 1, data: {
               message: "Successfully added email and password"
            }
         })
      }
      else {
         res.status(501).json({
            status: 0,
            data: { message: "Somthing wrong!" }
         })
      }
   } catch (error) {
      next(error)
   }

})


router.post("/email", async (req, res, next) => {
   try {
      let response = await userController.emailPasswordRegistartion(req.body)
      if (response) {
         res.status(200).json({
            status: 1,
            data: { message: "Successfully added email and password " }

         })
      }
      else {
         res.status(501).json({
            status: 0,
            data: {
               message: "Somthing wrong!"
            }
         })
      }
   } catch (error) {
      next(error)
   }

})


// GSTIN confirmation an
router.post("/gstin/yes", async (req, res, next) => {
   try {
      let data = await userController.gstinYes(req.body, req.files.gstinDocument.name)
      if (data) {
         res.status(200).json({
            status: 1,
            data: { message: "Successfully added " }
         })
      }
      else {
         res.status(501).json({
            status: 0,
            data: { message: "Somthing wrong!" }
         })
      }
   } catch (error) {
      next(error)
   }
})


//gst no 
router.post("/gstin/no", async (req, res, next) => {
   try {
      let response = await userController.gstNo(req.body, req.files.pancard.name)
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
            data: { message: "Somthing wrong!" }
         })
      }
   } catch (error) {
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
               message: "Try agian"
            }
         })
      }
   } catch (error) {
      next(error)
   }

})


// Business details
router.get("/business/details", async (req, res, next) => {
   try {
      if (req.query.gstin == "true") {
         if (req.query.contactPerson == "false") {
            let data = await userController.getBusinessDetials()
            if (data) {
               res.status(200).json({
                  status: 1,
                  data
               })
            }
            else {
               res.status(501).json({
                  status: 0,
                  data: {
                     message: "Try agin"
                  }
               })
            }
         }
         if (req.query.contactPerson == "true") {
            let data = await userController.getBusinessDetialsDifferent()
            if (data) {
               res.status(200).json({
                  status: 1,
                  data
               })
            }
            else {
               res.status(501).json({
                  status: 0,
                  data: {
                     message: "Try again"
                  }
               })
            }
         }
      }
      else {
         res.status(200).json({
            status: 0,
            data: {
               message: "You don't have GST.Please enter the data"
            }
         })
      }

   } catch (error) {
      next(error)
   }

})
// Business details type 
router.get("/business/types", async (req, res, next) => {
   try {
      let typeOfOperations = await userController.getTypeOfOperation(req.body)
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
router.post("/business/details", async (req, res, next) => {
   try {
      let data = await userController.postBusinessDetails(req.body,req.files ? req.files.pancard : undefined )
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
               message: "Try again"
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
      let guidelinesDoc = await userController.getGuidelinesDoc(req.query.typeOfOperationId)
      if (guidelinesDoc) {
         res.status(200).json({
            status: 1,
            data: {
               guidelinesDoc
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
router.post("/businessAddress/billing", async (req, res, next) => {
   console.log(req.body);
   try {
      let response = await userController.businessAddress(req.body, req.body.userId,req.files?  req.files.addressProof.name : undefined )
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
               message: "Try again"
            }
         })
      }
   } catch (error) {
      next(error)
   }

})


// Business address for shipping
router.post("/businessAddress/shipping", async (req, res, next) => {
   try {
      let response = await userController.businessAddressShipping(req.body, req.body.userId,req.files ? req.files.shippingAddressProof.name : undefined )
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
               message: "Internal server error"
            }
         })
      }
   } catch (error) {
      next(error)
   }

})

// Upload documents 
router.post("/doc/upload", async (req, res, next) => {
   try {
      if(req.files==null){
         res.status(501).json({
            status:0,
            data:{
               message:"File upload pending"
            }
         })
      }
      else
      {
         let docuemnt = await userController.uploadDocuments( req.files.panCard, req.files.addressProofFront, req.files.addressProofBack, req.files.businessproof, req.files.shippingAddressProof,
            req.files.shopOwnerPhoto, req.files.shopBoardPhoto, req.files.firmPancard, req.files.partnershipDeed, req.files.certificateIncorporation, req.files.memorandumAssociation, req.files.ArticlesAssociation, req.body.docId,req.body.gst, req.body.userId)
         if (docuemnt) {
            res.status(200).json({
               status: 1,
               data: { message: "Successfully added" }
            })
         }
         else {
            res.status(501).json({
               status: 0,
               data: {
                  message: "Internal server error"
               }
            })
         }
      }
   } catch (error) {
      next(error)
   }

})
// pendency document
router.get("/pendency/detect",async(req,res,next)=>{
   try {
      let pendency=await userController.getPendencyDocument(req.query.userId,req.query.docId)
      if(pendency){
         res.status(200).json({
            status:1,
            data:{
               pendency
            }
         })
      }
      else
      {
         res.status(501).json({
            status:0,
            data:{
               message:"user not found"
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
            message: "Internal server error"
         })
      }
   } catch (error) {
      next(error)
   }

})
// Whatsapp subscription
router.get("/whatsappSubscription", async (req, res, next) => {
   try {
      let response = await userController.whatsappSubscription(req.query.userId)
      if (response) {
         res.status(200).json({
            status: 1,
            data: {
               message: "Whatsapp subscription successfully"
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
      console.log(response.email);
      if (response) {
         let email = sendverficationEmail(response._id, response.email)
         res.status(200).json({
            status: 1,
            data: {
               message: "Verfication link send to your email "
            }
         })
      }
      else {
         res.status(501).json({
            status: 0,
            message: "Email not found"
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
               message: "Internal server issue"
            }
         })
      }
   } catch (error) {
      next(error)
   }

})
// pincode api
router.get("/pincode",(req,res,next)=>{
   try {
      let data=pincodeDirectory.lookup(req.query.pincode);
    if(!data.length==0){
       res.status(200).json({
          status:1,
          data:{
             data
          }
       })
    }
    else
    {
       res.status(501).json({
          status:0,
          data:{
             message:"No data found"
          }
       })
    }
   } catch (error) {
       next(error)
   }

})


// reach to Home screen  as guest user
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




module.exports = router;