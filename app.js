const express = require("express");
const mongoose = require("mongoose")
const dotenv = require("dotenv");
const path = require("path");


const app = express();

dotenv.config({ path: './config.env' });

const PORT = process.env.PORT;

require("./db/connection");

// const User = require("./model/userSchema")

app.use(express.json());

// we link the router files to make our route easy 
app.use(require('./router/auth'))


// app.get('/', (req, res) => {
//     res.send("Hello World from home")
// });


// app.get('/contact', (req, res) => {
//     res.cookie("test", "merndeveloper");
//     res.send("Hello World from contact")
// });

// app.get('/signin', (req, res) => {
//     res.send("Hello World from Login")
// });

// app.get('/signup', (req, res) => {
//     res.send("Hello World from Signup")
// });

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, '/client/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    })
}else{
    app.get('/', (req, res) => {
        res.send('Api Running');
    })
}


app.listen(PORT, () => {
    console.log(`Server is Running on port number ${PORT}`);
})