const express= require('express');
const app = express();
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const methodOverride = require('method-override')
const cloudinary = require('cloudinary')
const upload = require('express-fileupload')
const path = require('path')

const fakeEmployees = require('./seedDb.js')

//Can use http verbs using query string
app.use(methodOverride('_method'))

app.use(upload())

const User = require('./models/user')
const Employee = require('./models/employee')
const flash = require('connect-flash')


cloudinary.config({
    cloud_name: 'depk',
    api_secret: '7QO8JSyxyK2nliqsoV70Ca7zyyw',
    api_key: '749142549941399'
}) 



//Session config
app.use(require("express-session")({
    secret: "exceptionaire-Top web app development company in pune",
    resave: false,
    saveUninitialized: false
}))


//Flash configuration
app.use(flash())

//static configuration
app.use(express.static(__dirname+"/static"))


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

mongoose.connect("mongodb://localhost:27017")

app.get("/", (req, res)=> {
    res.render('./index.ejs', {currentUser : req.user})
})

app.get("/register", (req, res) => {
    res.render('./register.ejs')
})

app.get("/generate-random-employees", (req, res) => {
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


app.post("/register", function(req, res) {
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
    Employee.find({} ,function(err, employees){
        if(err){
            console.log(err)
            res.redirect("/", {errorMessage : "Search failed! Please try again"})
        }else{
            res.render("./employees.ejs", {employees: employees, currentUser: req.user})
        }

    })
})

app.post("/employees", isLoggedIn, (req, res) => {

    let name = req.body.employeeName,
        email = req.body.email,
        address = req.body.address,
        desgination = req.body.desgination,
        phoneNo = req.body.phoneNumber
    if(req.files){
        var file = req.files.empFile,
            fileName = file.name
        cloudinary.v2.uploader.upload(file.data, 
            function(error, result) {
                console.log(result, error)
            }); 
    }
    let employee = {
        name,
        email,
        address,
        phoneNo,
        desgination,
        empPhoto : req.files.empFile.name,
        author: {
            id: req.user.id,
            userName: req.user.username
        }
    }
    Employee.create(employee, function(err, newEmployee){
        if(err){
            res.redirect("/", {errorMessage: "Adding new employee failed"})
        }else{
            console.log(newEmployee)
            res.redirect("/employees")
        }
    })
})

app.get("/employees/:id/edit", (req, res) => {
    Employee.findById(req.params.id, (err, foundEmployee) => {
        if(err){
            console.log("Error finding employee")
            res.redirect("/")
        }
        else if(!foundEmployee){
            res.render("./index.ejs", {errorMessage: "Employee edit failed. Please try again"})
        }
        else{
            console.log(foundEmployee)
            res.render("./edit.ejs", {foundEmployee : foundEmployee})
        }
    })
})


app.put("/employees/:id/edit" , (req, res) => {

    let name = req.body.employeeName,
        email = req.body.email,
        address = req.body.address,
        desgination = req.body.desgination,
        phoneNo = req.body.phoneNumber

    let updatedEmployee = {
        name,
        email,
        address,
        phoneNo,
        desgination,
        empPhoto : req.files.empFile.name,
        author: {
            id: req.user.id,
            userName: req.user.username
        }
    }

    Employee.findByIdAndUpdate(req.params.id,updatedEmployee ,(err, updatedEmployee)=> {
        if(err){
            res.redirect("/")
        }else if(!updatedEmployee){y
            res.render("./employees",{errorMessage: "Employee updation failed"} )
        }else{
            Employee.find({}, (err, employees) => {
                res.render("./employees", {successMessage: "Employee "+updatedEmployee.name+" details are updated", employees: employees})
            })
            
        }
    })
})

app.delete("/employees/:id", (req , res) => {
    Employee.findByIdAndDelete(req.params.id,(err) => {
        if(err){
            res.render("./index.ejs", {errorMessage: "Could delete the employee.Please try again later"})
        }else{
            Employee.find({}, (err, employees) => {
                res.render("./employees", {successMessage: "Employee details are deleted", employees: employees})
            })
        }
    })
    
})




app.get("/image/:filename", (req, res) => {
    res.sendFile(path.join(__dirname, req.params.filename));
  });

const port = 8081
app.listen(port, function(){
    console.log(`Server has started on ${port} `)
})