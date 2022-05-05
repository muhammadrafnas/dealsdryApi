const mongoose = require('mongoose');


const AppSchema = new mongoose.Schema({
    version: String,
    installTimeStamp: {
        type: Date,
        default: new Date().toISOString()
    },
    unintsallTimeStamp:  {
        type: Date,
        default: new Date().toISOString()
    },
    downloadTimeStamp:  {
        type: Date,
        default: new Date().toISOString()
    }
}, { _id: false })


const DeviceSchema = new mongoose.Schema({
    deviceType: String,
    deviceId: String,
    deviceName: String,
    deviceOSVersion: String,
    deviceIPAddress: {
        type: String,
        default: '0.0.0.0'
    },
    app: AppSchema,
    lat: Number,
    long: Number,
    buyerGCMID: {
        type: String,
        default: null
    },
    buyerPEMID: {
        type: String,
        default: null
    }
})


let Device=mongoose.model("Devices", DeviceSchema);
module.exports = {
    Device:Device
}