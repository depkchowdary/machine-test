const mongoose = require('mongoose')

const empSchema = function(){
    this.empSchema = mongoose.Schema({
        name: String,
        email: String,
        address: String,
        desgination: String,
        phoneNo: String,
        empPhoto: String
    })

    return{
        empSchema,
    }
}

module.exports = empSchema();