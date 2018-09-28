const mongoose = require('mongoose')

const empSchema =  mongoose.Schema({
        name: String,
        email: String,
        address: String,
        desgination: String,
        phoneNo: String,
        empPhoto: String
    })

module.exports = mongoose.model("Employee", empSchema)