const mongoose = require('mongoose')

const userSchema = function(){
    this.userSchema = mongoose.Schema({
        name: String,
        email: String,
        password: String,
        created: {type: Date, default: new Date()},
        lastLoggedIn: Date,
    })

    return {
        userSchema,
    }
}

module.exports =userSchema();