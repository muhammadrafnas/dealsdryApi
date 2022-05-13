 
 
 const nodemailer = require("nodemailer")
 const { v4: uuidv4 } = require("uuid")
 const bcrypt = require('bcrypt')
 
 let transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
         user: process.env.AUTH_EMAIL,
         pass: process.env.AUTH_PASS
    }
 })
 
 transporter.verify((error, success) => {
    if (error) {
         console.log(error);
    }
    else {
         console.log(success);
    }
 })
 

 module.exports={

     sendverficationEmail : (_id, res) => {
        console.log(_id);
         console.log(process.env.AUTH_EMAIL);
        const currentUrl = "http://54.234.115.71:5000/api/v2/user";
        const uniqueString = uuidv4() + _id;
        //mail options
        const mailOptions = {
             from: process.env.AUTH_EMAIL,
             to: res,
             subject: "Verfiy Your Email",
             html: `<p> Verfiy your email address  to complete the signup  and login  into your account</p><p>This link is <b>expires in 1 hours</b></p> <p>Click <a href=${currentUrl + "/verify/" + _id + "/" + uniqueString} >here</a><to proceed. </p>`
        }
        const  saltRounds=10;
        bcrypt.hash(
           uniqueString,saltRounds
        ).then((hashUniqueString)=>{
           console.log(hashUniqueString);
        }).catch(()=>{
           res.json({
              status:"Failed",
              message:"An error occured while hashing email data"
           })
        })
     
        transporter.sendMail(mailOptions).then(() => {
             console.log("success");
        }).catch((error) => {
             console.log(error);
        })
        return currentUrl + "/verify/" + _id + "/" + uniqueString
     }
   
 }
 

