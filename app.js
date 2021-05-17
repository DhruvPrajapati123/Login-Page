//jshint esversion:6

require('dotenv').config()
const express = require("express")
const ejs = require("ejs")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const bcrypt = require('bcrypt');
const saltRounds = 10;
// var md5 = require('md5');
// const encrypt = require('mongoose-encryption');

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true}, {useUnifiedTopology: true})

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

// console.log(process.env.API_KEY);
// const secret = process.env.SECRET
// userSchema.plugin(encrypt, { secret: secret,  encryptedFields: ["password"] });

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

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        const newUser = new User({
            email: req.body.username,
            password: hash
        })
    
        newUser.save((err) => {
            if (err) {
                console.log(err);
            } else {
                res.render("secrets")
            }
        })
    });

    
})

app.post("/login", (req, res) => {

    User.findOne({email: req.body.username}, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                // Load hash from your password DB.
                bcrypt.compare(req.body.password, foundUser.password, function(err, result) {
                    if (result == true){
                        res.render("secrets")
                    } else {
                        res.send("Please Enter correct username and password")
                    }
                });
            }
        }
    })
})

app.listen(3000, () => console.log("Server is started using port 3000"))