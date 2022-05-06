const express = require("express")
const router = express.Router()
const userController = require("../controller/userController")


router.get("/list",async(req,res,next)=>{
    try {
        let category=await  userController.getcategory()
        if(category){
            res.json({
                status:1,
                data:{
                    category
                }
            })
        }
    } catch (error) {
        next(error)
    }
})












module.exports = router;