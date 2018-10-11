
const Employee = require('.././models/employee')
const User = require('.././models/user')

const middleware = {

    isLoggedIn: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect("/login")
    },
    isOwner: function isOwner(req, res, next){
        Employee.findById(req.params.id, (error, foundEmployee) => {
            if(foundEmployee.author.id == req.user.id){
                console.log("is owner")
                return next();
            }else{
                res.redirect("/employees")
            }
            
        })
    }
}
module.exports = middleware

