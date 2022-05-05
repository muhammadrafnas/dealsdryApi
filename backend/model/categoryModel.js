const mongoose = require('mongoose');


const categorySchema=new mongoose.Schema({
    label:String,
    icon:String
})

module.exports = category=mongoose.model("Category",categorySchema)