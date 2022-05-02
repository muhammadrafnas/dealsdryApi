const express = require("express")
const dotenv = require("dotenv")
dotenv.config()
const app = express()
const cors = require("cors")
const logger=require("morgan")
const registrationRouter = require("./router/RegistrationRouter")
const documentUploadRouter=require("./router/DocumentUploadRouter")
const connectDB=require("./config/db")
const { uploadDocuments } = require("./controller/userController")

connectDB()
app.use(logger('dev'))
app.use(express.json())
app.use(
    express.urlencoded({
        extended: false
    })
)
app.use(cors())
app.use("/api/v2/user", registrationRouter)
app.use("/api/v2/user/doc", documentUploadRouter)
app.use("/icons",express.static(__dirname + '/public/icons'));


app.use((err,req,res,next)=>{
    console.log(err);
    res.status(404).json({
        error:err.message
    })
})




const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))