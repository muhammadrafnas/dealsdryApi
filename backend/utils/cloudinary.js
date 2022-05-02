
const { resolve } = require('path');

const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME_CLOUDINARY,
    api_key: process.env.API_KEY_CLOUDINARY,
    api_secret: process.env.API_SCCRET_CLOUDINARY,
})


module.exports = {
    fileUpload: async(file) => {
       
        if(file==undefined) return 
        try {
            const uploadedResponse = await cloudinary.uploader.
                upload(file.path)
            console.log(uploadedResponse);
            return uploadedResponse.secure_url
        } catch (error) {
            console.log(error);
            return error
        }
    },
    docUpload: async(file) => {
        console.log(file);
        try {
            let docUrl={}
            return new Promise((resolve,reject)=>{
                Object.values(file).map(async(doc,index)=>{
                    const uploadedResponse = await cloudinary.uploader.
                        upload(doc[0].path)
                        docUrl[doc[0].fieldname]=uploadedResponse.secure_url
                        if(index +1 === Object.values(file).length){
                            resolve(docUrl)
                        }
                })
            })
        } catch (error) {
            console.log(error);
            return error
        }
    }
}

