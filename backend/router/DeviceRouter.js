const express = require("express")
const router = express.Router()
const dotenv = require("dotenv")
const userController = require("../controller/userController")


router.post("/add",async(req,res)=>{
    let response=await userController.addDevice(req.body)
    console.log(response);
    if(response){
        res.json({
            status:1,
            data:{
                 message:"Successfully Added",
                 _id:response._id
            }
        })
    }
    else
    {
        res.json({
            status:0,
            data:{
                message:"wrong"
            }
        })
    }
})


module.exports = router;