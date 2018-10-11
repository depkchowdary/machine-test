
const express =require('express')
const router = express.Router()
const passport = require('passport')
const User = require('.././models/user')
const middleware = require('.././middlewares/index')

const fakeEmployees = require('../seedDb.js')

router.get("/", (req, res)=> {
    res.render('./index.ejs', {currentUser : req.user})
})

router.get("/register", (req, res) => {
    res.render('./register.ejs')
})

router.get("/generate-random-employees",middleware.isLoggedIn, (req, res) => {
    fakeEmployees.forEach((emp, index) => {
        Employee.create({name: emp.name,address: emp.address, email: emp.emailId, desgination: emp.designation, phoneNo:emp.phoneNumber, empPhoto: emp.empPhoto}, function(err, data){
            if(err){
                console.log(err)
            }else{
                console.log("seeded "+ index + " employees ")
            }
        })
    })
    res.render("./index", {successMessage: "5 Random employees are generated"})

})


router.post("/register", function(req, res) {
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

router.get("/login", function(req, res) {
    res.render("login", { page: "login" })
})

router.post("/login", passport.authenticate("local", {
    successRedirect: "/employees",
    failureRedirect: "/login"
}), function(req, res) {
    console.log("logged in")
});

router.get("/logout", function(req, res) {

    req.logout();
    req.flash("success", "You are logged out sucessfully!")
    res.redirect("/");
});

module.exports = router