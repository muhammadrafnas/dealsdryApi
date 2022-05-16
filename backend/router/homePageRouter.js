const express = require("express");
const router=express.Router()
const homePageData=require("../homePage/homePageData")

router.get("/withoutPrice",async(re,res)=>{
    res.status(200).json({
        status:1,
        data:homePageData
    })
})

module.exports = router;