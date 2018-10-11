const express= require('express');
const app = express();
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const methodOverride = require('method-override')
require('dotenv').config()

//Can use http verbs using query string
app.use(methodOverride('_method'))

const flash = require('connect-flash')





//Session config
app.use(require("express-session")({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))


//Flash configuration
app.use(flash())

//static configuration
app.use(express.static(__dirname+"/static"))
const User = require('./models/user')

// Passport config
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//adding this to every res object
app.use(function(req, res, next) {
    res.locals.errorMessage = req.flash("error");
    res.locals.successMessage = req.flash("success");
    res.locals.currentUser = req.user;
    next();
})




app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))

mongoose.connect(process.env.DB_URL)


//Routes
const employeeRoutes = require('./routes/employee')
const userRoutes = require('./routes/user')

app.use(employeeRoutes)
app.use(userRoutes)


//=======================>
//Server Listen
//=======================>
const port = 8081
app.listen(port, function(){
    console.log(`Server has started on ${port} `)
})