const express = require("express")
const dotenv = require("dotenv")
dotenv.config()
const app = express()
const cors = require("cors")
const fileUpload = require('express-fileupload');
const userRouter = require("./router/userRouter")
const connectDB=require("./config/db")
connectDB()
app.use(express.json())
app.use(
    express.urlencoded({
        extended: false
    })
)
app.use(fileUpload({
    createParentPath: true
}));
app.use(cors())
app.use("/user", userRouter)









const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))