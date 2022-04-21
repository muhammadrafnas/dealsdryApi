const express = require("express")
const router = express.Router()
const { sendOtp, verificationOtp } = require("../utils/otp")
const userController = require("../controller/userController")
const { sendverficationEmail } = require("../utils/nodeMailer")



// send OTP api for mobile number verification
router.post("/otp", async (req, res, next) => {
   console.log(req.body);
   try {
      let phoneExist = await userController.checkPhone(req.body.mobileNumber)
      if (phoneExist.status) {
         res.json({status:1,data:{ message: "Phone number verification already done", userData: phoneExist.user,mobile_number_exists:"true"  } })
      }
      else {
         let response = await sendOtp(req.body.mobileNumber)

         if (response) {
            res.status(200).json({
               status: 1,
               data: { message: "OTP send successfully ",mobile_number_exists:"false" }
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


// GSTIN confirmation
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
            status:1,
            data: {
               message: "Successfully added"
            }
         })
      }
      else{
         res.status(501).json({
            status:0,
            data:{message:"Somthing wrong!"}
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
            status:1,
            data:{message: "Successfully added "}
         })
      }
      else
      {
         res.status(501).json({
            status:0,
            data:{
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
      let data = await userController.getBusinessDetials()
      if (data) {
         res.status(200).json({
            status:1,
            data
         })
      }
      else
      {
         res.status(501).json({
            status:0,
            data:{
               message:"Try agin"
            }
         })
      }
   } catch (error) {
      next(error)
   }

})


// Business details contact perosn is different
router.get("/business/details/different", async (req, res, next) => {
   try {
      let data = await userController.getBusinessDetialsDifferent()
      if (data) {
         res.status(200).json({
            status:1,
            data
         })
      }
      else
      {
         res.status(200).json({
            status:0,
            data:{
               message:"Try again"
            }
         })
      }
   } catch (error) {
      next(error)
   }

})


//List and guidlines propreitership
router.get("/guidelinesDocuments/proprietorship/gstYes", async (req, res, next) => {
   try {
      let data = await userController.getDocuments()
      if (data) {
         res.status(200).json({
            status:1,
            data
         })
      }
      else
      {
         res.status(501).json({
            status:0,
            data:{
               message:"Try again"
            }
         })
      }
   } catch (error) {
      next(error)
   }

})


//list and guidline propreitership
router.get("/guidelinesDocuments/proprietorship/gstNo", async (req, res, next) => {
   try {
      let data = await userController.getDocumentsGstNo()
      if (data) {
         res.status(200).json({
            status:1,
            data
         })
      }
      else
      {
         res.status(501).json({
            status:0,
            data:{
               message:"Try again"
            }
         })
      }
   } catch (error) {
      next(error)
   }
})
//list and guidline partnership and LLP
router.get("/guidelinesDocuments", async (req, res, next) => {
   try {
      let data = await userController.getDocumentsPartnershipAndLlp()
      if (data) {
         res.status(200).json({
            status:1,
            data
         })
      }
      else
      {
         res.status(501).json({
            status:0,
            message:"Try again"
         })
      }
   } catch (error) {
      next(error)
   }
})

// list and guidline documents private limited company
router.get("/guidelinesDocuments/privateLimited/publicLimited/spc", async (req, res) => {
   try {
      let data = await userController.getDocumnetPrivateLimited()
      if (data) {
         res.status(200).json({
            status:1,
         
            data
         })
      }
      else
      {
         res.status(501).json({
            status:0,
            data:{
               message:"Try again"
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
      let response = await userController.businessAddress(req.body, req.body.userId, req.files.addressProof.name)
      if (response) {
         res.status(200).json({
            status:1,
            data:{
               message: "Successfully added"
            }
         })
      }
      else
      {
         res.status(501).json({
            status:0,
            data:{
               message:"Try again"
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
      let response = await userController.businessAddressShipping(req.body, req.body.userId, req.files.shippingAddressProof.name)
      if (response) {
         res.status(200).json({
            status:1,
            data:{
               message: "Successfully added"
            }
         })
      }
      else
      {
         res.status(501).json({
            status:0,
            data:{
               message:"Internal server error"
            }
         })
      }
   } catch (error) {
      next(error)
   }

})


// Upload documents gst Yes propreitership
router.post("/uploadDocuments/proprietorship/gstYes", async (req, res, next) => {
   try {
      let docuemnt = await userController.uploadDocumentGstYes(req.files.panCard.name, req.files.addressProofFront.name, req.files.addressProofBack.name, req.files.businessproof.name, req.files.shippingAddressProof.name, req.body.userId)
      if (docuemnt) {
         res.status(200).json({
            status:1,
            data:{ message: "Successfully added" }
         })
      }
      else
      {
         res.status(501).json({
            status:0,
            data:{
               message: "Internal server error"
            }
         })
      }
   } catch (error) {
      next(error)
   }

})

// Upload documents gstNo propreitership
router.post("/uploadDocuments/proprietorship/gstNo", async (req, res, next) => {
   try {
      let data = await userController.uplodDocumentsGstNo(req.files.panCard.name, req.files.addressProofFront.name, req.files.addressProofBack.name, req.files.businessproof.name, req.files.shippingAddressProof.name, req.files.shopOwnerPhoto.name, req.files.shopBoardPhoto.name, req.body.userId)
      if (data) {
         res.status(200).json({
            status:1,
            data:{
               message: "Successfully added"
            }
         })
      }
   } catch (error) {
      next(error)
   }

})

// Upload documents  partnership and llp
router.post("/uploadDocuments", async (req, res, next) => {
   try {
      let data = await userController.uplodDocuments(req.files.panCard.name, req.files.addressProofFront.name, req.files.addressProofBack.name, req.files.businessproof.name, req.files.shippingAddressProof.name, req.files.firmPancard.name, req.files.partnershipDeed.name, req.body.userId)
      console.log(data);
      if (data) {
         res.status(200).json({
            status:1,
            data:{
               message: "Successfully added"
            }
         })
      }
      else{
         res.status(501).json({
            status:0,
            data:{
               message: "Internal server error"
            }
         })
      }
   } catch (error) {
      next(error)
   }
})
// Upload documents private limited company Public limited SPC
router.post("/uploadDocuments/privateLimited/publicLimited/spc", async (req, res,next) => {
   try {
      let response = await userController.uploadDocumnetPrivateLimited(req.files.companyPancard.name, req.files.panCard.name, req.files.addressProofFront.name, req.files.addressProofBack.name, req.files.businessproof.name, req.files.shippingAddressProof.name, req.files.certificateIncorporation.name, req.files.memorandumAssociation.name, req.files.ArticlesAssociation.name, req.body.userId)
      console.log(response);
      if (response) {
         res.status(200).json({
            status:1,
            data:{
               message: "Successfully added"
            }
         })
      }
      else{
         res.status(501).json({
            status:0,
            data:{
               message:"Internal server error"
            }
         })
      }
   } catch (error) {
      next(error) 
   }
  
})

//Registration With Pendency Proprietorship document gstYes
router.get("/pendencyDocument/proprietorship/gstYes", async (req, res, next) => {
   try {
      let response = await userController.getPendencyDocumentGstYes(req.query.userId)
      if (response) {
         res.json(response)
      }
   } catch (error) {
      next(error)
   }

})


// Pendency document Proprietorship gstNo
router.get("/pendencyDocument/proprietorship/gstNo", async (req, res, next) => {
   try {
      let data = await userController.getPendencyDocumentGstNo(req.query.userId)
      if (data) {
         res.json(data)
      }
   } catch (error) {
      next(error)
   }

})
// Pendency document partnership and llp
router.get("/pendencyDocuments", async (req, res, next) => {
   try {
      let data = await userController.getPendencyDocumentPartnershipAndLlp(req.query.userId)
      if (data) {
         res.json({
            status:1,
            data
         })
      }
      else
      {
         res.status(501).json({
            status:0,
            message:"Internal server error"
         })
      }
   } catch (error) {
      next(error)
   }

})
// Pendency document private limited
router.get("/pendencyDocument/privateLimited/publicLimited/spc", async (req, res, next) => {
   try {
      let data = await userController.getPendencyDocumentPrivateLimited(req.query.userId)
      if (data) {
         res.status(200).json({
            status:1,
            data
         })
      }
      else
      {
         res.status(501).json({
            status:0,
            message:"Internal server error"
         })
      }
   } catch (error) {
      next(error)
   }

})
// without pendency document
router.get("/withoutPendencyDocument", async (req, res, next) => {
   try {
      let data = await userController.getWithoutPendencyDocumnet(req.query.userId)
      if (data) {
         res.status(200).json({
            status:1,
            data
         })
      }
      else
      {
         res.status(501).json({
            status:0,
            message:"Internal server error"
         })
      }
   } catch (error) {
      next(error)
   }

})
// whatsapp subscription
router.get("/whatsappSubscription", async (req, res, next) => {
   try {
      let response = await userController.whatsappSubscription(req.query.userId)
      if (response) {
         res.status(200).json({
            status:1,
            data:{
               message: "Whatsapp subscription successfully"
            }
         })
      }
   } catch (error) {
      next(error)
   }
})


// email verfication
router.get("/email/verification", async (req, res, next) => {
   try {
      let response = await userController.getEmail(req.query.userId)
      console.log(response.email);
      if (response) {
         let email = sendverficationEmail(response._id, response.email)
         res.status(200).json({
            status:1,
            data:{
               message: "Verfication link send to your email "
            }
         })
      }
      else
      {
         res.status(501).json({
            status:0,
            message:"Email not found"
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


//get business type
router.get("/businessType", async (req, res, next) => {
   try {
      let response = await userController.businessType(req.body)
      if (response) {
         res.status(200).json({
            status:1,
            data:{
               message: "Successfully added"
            }
         })
      }
      else
      {
         res.status(501).json({
            status:0,
            data:{
               message:"Internal server issue"
            }
         })
      }
   } catch (error) {
      next(error)
   }

})



// reach to home screen as a guest
router.get("/home", (req, res, next) => {
   try {
      res.status(200).json({
         status:1,
         data:{
            message: "Successfully enter to home screen"
         }
      })
   } catch (error) {
      next(error)
   }

})




module.exports = router;