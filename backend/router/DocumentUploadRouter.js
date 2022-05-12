const express = require("express")
const router = express.Router()
const dotenv = require("dotenv")
const upload=require("../utils/multer")
const userController = require("../controller/userController")
dotenv.config()


// Upload documents 
router.post("/upload",upload.fields([{name:'panCard'},{name:'addressProofFront'},{name:"addressProofBack"},{name:"businessproof"},{name:"shippingAddressProof"},{name:"shopOwnerPhoto"},{name:"shopBoardPhoto"},{name:"firmPancard"},{name:"partnershipDeed"},{name:"certificateIncorporation"},{name:"memorandumAssociation"},{name:"ArticlesAssociation"}]), async (req, res, next) => {
    try {
       console.log(req.files);
       if(Object.keys(req.files).length === 0){
          res.status(200).json({
             status:1,
             data:{
                message:"File upload pending"
             }
          })
       }
       else
       {
          let docuemnt = await userController.uploadDocuments(req.files, req.body.docId,req.body.gst,req.body.referral, req.body.userId)
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
                   message: "wrong"
                }
             })
          }
       }
    } catch (error) {
       next(error)
    }
 
 })

 module.exports = router;