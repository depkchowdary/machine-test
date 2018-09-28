const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = mongoose.Schema({
        name: String,
        email: String,
        password: String,
        created: {type: Date, default: new Date()},
        lastLoggedIn: Date,
    })

userSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model("User", userSchema)