const app = require('express')();
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const LocalStrategy = require('passport-local')


const User = require('./models/user')
const Employee = require('./models/employee')

const flash = require('connect-flash')


//passport config

//Session config

app.use(require("express-session")({
    secret: "exceptionaire-Top web app development company in pune",
    resave: false,
    saveUninitialized: false
}))


//
app.use(flash())

//adding flash to every req object
app.use(function(req, res, next) {
    res.locals.errorMessage = req.flash("error");
    res.locals.successMessage = req.flash("success");
    res.locals.currentUser = req.user;
    next();
})

// Passport config
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))

mongoose.connect("mongodb://localhost:27017")

app.get("/", (req, res)=> {
    res.render('./index.ejs')
})

app.get("/register", (req, res) => {
    res.render('./register.ejs')
})

app.post("/register", function(req, res) {

    console.log(req.body)
    User.register(new User({ username: req.body.username, email: req.body.email }), req.body.password, function(err, user) {

        if (err) {
            req.flash("error", err.message)
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Hello! Welcome, " + user.username)
            res.redirect("/");
        });
    })
});

app.get("/login", function(req, res) {
    res.render("login", { page: "login" })
})

app.post("/login", passport.authenticate("local", {
    successRedirect: "/employees",
    failureRedirect: "/login"
}), function(req, res) {
    console.log("logged in")
});

app.get("/logout", function(req, res) {

    req.logout();
    req.flash("success", "You are logged out sucessfully!")
    res.redirect("/");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login")
}

app.get("/employees",isLoggedIn, (req, res) => {
    res.render("./employees.ejs")
})





const port = process.env.PORT || 8081
app.listen(port, function(){
    console.log(`Server has started on ${port} `)
})