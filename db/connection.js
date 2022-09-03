const mongoose = require("mongoose");

const dbUrl = process.env.DATABASE;

mongoose.connect(dbUrl,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connection Successfull");
}).catch((err) => {
    console.log(err);
})