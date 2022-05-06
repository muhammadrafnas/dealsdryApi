const axios = require("axios")


const axiosGst = axios.create({
    baseURL: "https://test.zoop.one/api/v1/in/merchant/gstin",
    headers: { 'api-key': process.env.ZOOP_API_KEY, 'app-id': process.env.ZOOP_APP_ID }
});

async function gstDetailsGetfromApi(gstNumber) {
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

}

async function getPanDetailsfromApi(panNumber) {

}




module.exports = {
    gstDetailsGetfromApi: gstDetailsGetfromApi,
    getPanDetailsfromApi: getPanDetailsfromApi
}