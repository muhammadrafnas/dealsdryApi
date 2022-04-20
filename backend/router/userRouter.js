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
         res.json({status:1,data:{ message: "Phone number verfication already done", userData: phoneExist.user,mobile_number_exists:"true"  } })
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
router.post("/selectCategory", async (req, res, next) => {
   try {
      let response = await userController.registrationSelectCategory(req.body.category, req.body.userId)
      if (response) {
         res.status(200).send({
            message: "Successfully added "
         })
      }
   } catch (error) {
      next(error)
   }

})


// Business details
router.get("/businessDetails", async (req, res, next) => {
   try {
      let businessDetails = await userController.getBusinessDetials()
      if (businessDetails) {
         res.json(businessDetails)
      }
   } catch (error) {
      next(error)
   }

})


// Business details contact perosn is different
router.get("/businessDetailsDifferent", async (req, res, next) => {
   try {
      let businessDetails = await userController.getBusinessDetialsDifferent()
      if (businessDetails) {
         res.json(businessDetails)
      }
   } catch (error) {
      next(error)
   }

})


//List and guidlines propreitership
router.get("/guidelinesDocumentsProprietorshipGstYes", async (req, res, next) => {
   try {
      let documents = await userController.getDocuments()
      if (documents) {
         res.json(documents)
      }
   } catch (error) {
      next(error)
   }

})


//list and guidline propreitership
router.get("/guidelinesDocumentsProprietorshipGstNo", async (req, res, next) => {
   try {
      let data = await userController.getDocumentsGstNo()
      if (data) {
         res.json(data)
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
         res.json(data)
      }
   } catch (error) {
      next(error)
   }
})

// list and guidline documents private limited company
router.get("/guidelinesDocumentsPrivateLimited", async (req, res) => {
   try {
      let data = await userController.getDocumnetPrivateLimited()
      if (data) {
         res.status(200).json(data)
      }
   } catch (error) {
      next(error)
   }
})
//Business address for billing
router.post("/businessAddressBilling", async (req, res, next) => {
   try {
      let response = await userController.businessAddress(req.body, req.body.userId, req.files.addressProof.name)
      if (response) {
         res.status(200).send({
            message: "Successfully added"
         })
      }
   } catch (error) {
      next(error)
   }

})


// business address for shipping
router.post("/businessAddressShipping", async (req, res, next) => {
   try {
      let response = await userController.businessAddressShipping(req.body, req.body.userId, req.files.shippingAddressProof.name)
      if (response) {
         res.status(200).send({
            message: "Successfully added"
         })
      }
   } catch (error) {
      next(error)
   }

})


// upload documents gst Yes propreitership
router.post("/uploadDocumentsProprietorshipGstYes", async (req, res, next) => {
   try {
      let docuemnt = await userController.uploadDocumentGstYes(req.files.panCard.name, req.files.addressProofFront.name, req.files.addressProofBack.name, req.files.businessproof.name, req.files.shippingAddressProof.name, req.body.userId)
      if (docuemnt) {
         res.status(200).send({
            message: "Successfully added"
         })
      }
   } catch (error) {
      next(error)
   }

})

// upload documents gstNo propreitership
router.post("/uploadDocumentsProprietorshipGstNo", async (req, res, next) => {
   try {
      let data = await userController.uplodDocumentsGstNo(req.files.panCard.name, req.files.addressProofFront.name, req.files.addressProofBack.name, req.files.businessproof.name, req.files.shippingAddressProof.name, req.files.shopOwnerPhoto.name, req.files.shopBoardPhoto.name, req.body.userId)
      if (data) {
         res.status(200).send({
            message: "Successfully added"
         })
      }
   } catch (error) {
      next(error)
   }

})

// upload documents  partnership and llp
router.post("/uploadDocuments", async (req, res, next) => {
   try {
      let data = await userController.uplodDocuments(req.files.panCard.name, req.files.addressProofFront.name, req.files.addressProofBack.name, req.files.businessproof.name, req.files.shippingAddressProof.name, req.files.firmPancard.name, req.files.partnershipDeed.name, req.body.userId)
      if (data) {
         res.status(200).send({
            message: "Successfully added"
         })
      }
   } catch (error) {
      next(error)
   }
})
// upload documents private limited company
router.post("/uploadDocumentsPrivateLimited", async (req, res) => {
   let response = await userController.uploadDocumnetPrivateLimited(req.files.companyPancard.name, req.files.panCard.name, req.files.addressProofFront.name, req.files.addressProofBack.name, req.files.businessproof.name, req.files.shippingAddressProof.name, req.files.certificateIncorporation.name, req.files.memorandumAssociation.name, req.files.ArticlesAssociation.name, req.body.userId)
   if (response) {
      res.status(200).send({
         message: "Successfully added"
      })
   }
})

//Registration With Pendency document gstYes
router.get("/pendencyDocumentProprietorshipGstYes", async (req, res, next) => {
   try {
      let response = await userController.getPendencyDocumentGstYes(req.query.userId)
      if (response) {
         res.json(response)
      }
   } catch (error) {
      next(error)
   }

})


// pendency document gstNo
router.get("/pendencyDocumentProprietorshipGstNo", async (req, res, next) => {
   try {
      let data = await userController.getPendencyDocumentGstNo(req.query.userId)
      if (data) {
         res.json(data)
      }
   } catch (error) {
      next(error)
   }

})
// pendency document partnership 
router.get("/pendencyDocuments", async (req, res, next) => {
   try {
      let data = await userController.getPendencyDocumentPartnershipAndLlp(req.query.userId)
      if (data) {
         res.json(data)
      }
   } catch (error) {
      next(error)
   }

})
// pendency document private limited
router.get("/pendencyDocumentPrivatelimited", async (req, res, next) => {
   try {
      let pendency = await userController.getPendencyDocumentPrivateLimited(req.query.userId)
      if (pendency) {
         res.status(200).json(pendency)
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
         res.status(200).json(data)
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
         res.status(200).send({
            message: "Whatsapp subscription successfully"
         })
      }
   } catch (error) {
      next(error)
   }
})


// email verfication
router.get("/emailVerification", async (req, res, next) => {
   try {
      let response = await userController.getEmail(req.query.userId)
      console.log(response.email);
      if (response) {
         let email = sendverficationEmail(response._id, response.email)
         res.status(200).send({
            message: "Verfication link send to your email "
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
         res.status(200).send({
            message: "Successfully added"
         })
      }
   } catch (error) {
      next(error)
   }

})



// reach to home screen as a guest
router.get("/home", (req, res, next) => {
   try {
      res.status(200).send({
         message: "Successfully enter to home screen"
      })
   } catch (error) {
      next(error)
   }

})




module.exports = router;