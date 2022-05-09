const axios = require("axios")


const axiosGst = axios.create({
    baseURL: "https://test.zoop.one/api/v1/in/merchant/gstin",
    headers: { 'api-key': process.env.ZOOP_API_KEY, 'app-id': process.env.ZOOP_APP_ID }
});

const axiosPan = axios.create({
    baseURL: "https://test.zoop.one/api/v1/in/identity/pan",
    headers: { 'api-key': process.env.ZOOP_API_KEY, 'app-id': process.env.ZOOP_APP_ID }
});

async function gstDetailsGetfromApi(gstNumber) {
    try {
        let { data } = await axiosGst.post("/lite",
        {
            "data": {
                "business_gstin_number": gstNumber,
                "consent": "Y",
                "consent_text": "I hear by declare my consent agreement for fetching my information via ZOOP API"
            }
        })
    if (data.success == true) {
        return { status: data.result.current_registration_status, legal_name: data.result.legal_name, business_address: data.result.primary_business_address, type_Of_operation: data.result.business_nature, data_registration: data.result.register_date }
    }
    else {
        return { gstNumber: gstNumber, status: false }
    }
    } catch (error) {
        console.log(error);
    }
}

async function getPanDetailsfromApi(panNumber) {
    try {
        let {data} = await axiosPan.post("/lite", {
            "data": {
                "customer_pan_number": panNumber,
                "consent": "Y",
                "consent_text": "I hear by declare my consent agreement for fetching my information via ZOOP API."
            }
        })
        if(data.success == true){
            return {status:data.result.pan_status,name:data.result.user_full_name,panNumber:data.result.pan_number}
        }
        else {
            return { pannumber:panNumber, status:"Not valid" }
        } 
    } catch (error) {
        return null
    }    
}




module.exports = {
    gstDetailsGetfromApi: gstDetailsGetfromApi,
    panDetailsGetfromApi: getPanDetailsfromApi
}