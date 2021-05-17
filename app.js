//jshint esversion:6

const express = require("express")
const ejs = require("ejs")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const encrypt = require('mongoose-encryption');

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true}, {useUnifiedTopology: true})

const userSchema = {
    email: String,
    password: String
}


const User = new mongoose.model("User", userSchema)

const app = express()

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

app.get("/", (req, res) => {
    res.render("home")
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.get("/register", (req, res) => {
    res.render("register")
})

app.post("/register", (req, res) => {

    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })

    newUser.save((err) => {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets")
        }
    })
})

app.post("/login", (req, res) => {
    User.findOne({email: req.body.username}, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password == req.body.password){
                    res.render("secrets")
                } else {
                    res.send("Please Enter correct username and password")
                }
            }
        }
    })
})

app.listen(3000, () => console.log("Server is started using port 3000"))