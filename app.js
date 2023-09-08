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
app.use(require('./router/auth'));


app.use(express.static(path.join(__dirname, './client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/build/index.html'));
});


app.listen(PORT, () => {
    console.log(`Server is Running on port number ${PORT}`);
})