const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../model/userSchema");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/verifyToken");
const { findOne } = require("../model/userSchema");
require("../db/connection");

// router.get('/', (req, res) => {
//     res.send("Hello World from home router")
// });


// Using Promises

// router.post('/register', (req, res) => {
//     // console.log(req.body)
//     // res.json({message: req.body})

//     const { name, email, phone, work, password, cpassword } = req.body;

//     if(!name || !email || !phone || !work || !password || !cpassword) {
//         return res.status(422).json({ error: "Plz Filled The Field Properly" })
//     }

//     User.findOne({email: email})
//        .then((userExist) => {
//         if(userExist){
//             return res.status(422).json({ error: "Email Already Exist" });
//         }

//         // const user = new User({ name: name, email: email, phone: phone, work: work, password: password, cpassword: cpassword });
//         const user = new User({ name, email, phone, work, password, cpassword });

//         user.save().then(() => {
//             res.status(201).json({ message: "User Registered Successfully" });
//         }).catch((error) => { res.status(500).json({ message: "Failed To Registered" }) })

//        }).catch((error) => { console.log(error) })

// });


// Using Async-Await

router.post('/register', async (req, res) => {

    const { name, email, phone, work, password, cpassword } = req.body;

    if (!name || !email || !phone || !work || !password || !cpassword) {
        return res.status(422).json({ error: "Plz Filled The Field Properly" })
    }

    try {

        const userExist = await User.findOne({ email: email });

        if (userExist) {
            return res.status(422).json({ error: "Email Already Exist" });
        } else if (password != cpassword) {
            return res.status(422).json({ error: "Password are not matching" });
        } else {

            const user = new User({ name, email, phone, work, password, cpassword });

            // yaha pe

            await user.save();

            return res.status(201).json({ message: "User Registered Successfully" })

        }

    }

    catch (error) {
        console.log(error);
    }

});


// Login Route

router.post('/signin', async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Plz Filled The Data" });
        }

        const userLogin = await User.findOne({ email: email });

        if (userLogin) {

            const isMatch = await bcrypt.compare(password, userLogin.password);

            if (isMatch) {

                const token = await userLogin.generateAuthToken();
                // console.log(token);

                // res.cookie('jwtoken', token, {
                //     expires: new Date(Date.now() + 25892000000),
                //     httpOnly: true
                // });

                res.json({ message: "User Signin Successfully", jwtToken: token });

            } else {
                res.status(400).json({ message: "Invalid Credentials" });
            }

        } else {
            res.status(400).json({ message: "Invalid Credentials" });
        }

    } catch (error) {
        console.log(error)
    }

});


// About Page Route

router.get('/about', verifyToken, (req, res) => {
    res.send(req.rootUser);
});

// Get Data For Contact And Home Page

router.get('/getdata', verifyToken, (req, res) => {
    res.send(req.rootUser);
});


// Contact Page

router.post('/contact', verifyToken, async (req, res) => {

    try{

        const { name, email, phone, message } = req.body;

        if(!name || !email || !phone || !message){
            console.log("Error in the Contact Form")
            res.json({ error: "Please filled the contact form" });
        }

        const userContact = await User.findOne({ _id: req.userId })

        if(userContact){

            const userMessage = await userContact.addMessage(name, email, phone, message);

            await userContact.save();

            res.status(201).json({ message: "user Contact successfully" });

        }

    }catch(error){
        console.log(error)
    }

})

// Logout Page

router.get('/logout', (req, res) => {
    // localStorage.removeItem('jwtToken');
    res.status(200).send({message: "User Logout"});
});


module.exports = router;