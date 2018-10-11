
const express =require('express')
const router = express.Router()
const Employee = require('.././models/employee')
const middleware = require('.././middlewares/index')
const cloudinary = require('cloudinary')


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUDNAME,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    api_key: process.env.CLOUDINARY_API_KEY
}) 

//Multer config
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

router.get("/employees",middleware.isLoggedIn, (req, res) => {
    Employee.find({} ,function(err, employees){
        if(err){
            console.log(err)
            res.redirect("/", {errorMessage : "Search failed! Please try again"})
        }else{
            res.render("./employees.ejs", {employees: employees, currentUser: req.user})
        }

    })
})

router.post("/employees", middleware.isLoggedIn,upload.single('employee[empPhoto]'), (req, res) => {
    if(req.file){
        cloudinary.v2.uploader.upload(req.file.path, 
            function(error, result) {
                if(error){
                    res.render("./employees", {errorMessage: "Employee photo upload failed. Please edit from edit page"})
                }else{
                    req.body.employee.empPhoto = result.secure_url
                    req.body.employee.author = {
                        id: req.user.id,
                        userName: req.user.username
                    }
                    Employee.create(req.body.employee, function(err, newEmployee){
                        if(err){
                            res.redirect("/", {errorMessage: "Adding new employee failed"})
                        }else{
                            res.redirect("/employees")
                        }
                    })
                }
            }); 
    }
})

router.get("/employees/:id/edit", (req, res) => {
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


router.put("/employees/:id/edit" ,middleware.isLoggedIn,middleware.isOwner,upload.single('employee[empPhoto]'), (req, res) => {
    cloudinary.v2.uploader.upload(req.file.path, (error, result) => {
        if(error){
            res.render("./employees", {errorMessage : "Employee updation failed due to errors"})
        }else{
            req.body.employee.author = {
                id: req.user.id,
                userName: req.user.userName
            }
            req.body.employee.empPhoto = result.secure_url  
            Employee.findByIdAndUpdate(req.params.id,req.body.employee ,(err, updatedEmployee)=> {
                if(err){
                    res.redirect("/")
                }else if(!updatedEmployee){
                    res.render("./employees",{errorMessage: "Employee updation failed"} )
                }else{
                    Employee.find({}, (err, employees) => {
                        res.render("./employees", {successMessage: "Employee "+updatedEmployee.name+" details are updated", employees: employees})
                    })
                    
                }
            })
        }

    })


})

router.delete("/employees/:id",middleware.isLoggedIn,middleware.isOwner, (req , res) => {
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

module.exports = router