const mongoose = require('mongoose')

const empSchema =  mongoose.Schema({
        name: String,
        email: String,
        address: String,
        desgination: String,
        phoneNo: String,
        empPhoto: String,
        author: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            userName: String
        }
    })

module.exports = mongoose.model("Employee", empSchema)