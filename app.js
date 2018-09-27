const app = require('express')();
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const passportLocal = require('passport-local')

app.set('view engine', 'ejs')
app.use(bodyParser.json())

mongoose.connect("mongodb://localhost:27017")

app.get("/", (req, res)=> {
    res.render('./index.ejs')
})

app.get("/register", (req, res) => {
    res.send("Register page")
})

app.get("/login", (req, res) => {
    res.send("Login page")
})


const port = process.env.PORT || 8081
app.listen(port, function(){
    console.log(`Server has started on ${port} `)
})