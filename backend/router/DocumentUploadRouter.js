const express = require("express")
const router = express.Router()
const cloudinary=require("../utils/cloudinary")
const dotenv = require("dotenv")
const upload=require("../utils/multer")
const userController = require("../controller/userController")
dotenv.config()


// Upload documents 
router.post("/upload",upload.fields([{name:'panCard'},{name:'addressProofFront'},{name:"addressProofBack"},{name:"businessproof"},{name:"shippingAddressProof"},{name:"shopOwnerPhoto"},{name:"shopBoardPhoto"},{name:"firmPancard"},{name:"partnershipDeed"},{name:"certificateIncorporation"},{name:"memorandumAssociation"},{name:"ArticlesAssociation"}]), async (req, res, next) => {
    try {
       if(Object.keys(req.files).length === 0){
          res.status(501).json({
             status:0,
             data:{
                message:"File upload pending"
             }
          })
       }
       else
       {
          let uploadedResponse=await  cloudinary.docUpload(req.files)
          console.log(uploadedResponse);
          let docuemnt = await userController.uploadDocuments(uploadedResponse, req.body.docId,req.body.gst,req.body.referral, req.body.userId)
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

 module.exports = router;