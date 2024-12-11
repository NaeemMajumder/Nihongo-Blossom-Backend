if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
// import packages
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");

// app and port
const app = express()
const port = process.env.PORT || 8080;

// mongoose connect
let mongo_url = "mongodb://127.0.0.1:27017/NihongoBlossom";
main().then(()=>{
    console.log("mongodb is connected");
}).catch((error)=>{
    console.log(error);
})
async function main() {
    await mongoose.connect(mongo_url);
}

// middleware
app.use(cors());
app.use(express.json());



app.get('/',(req, res)=>{
    res.send('This is a root route');
})

app.listen(port, ()=>{
    console.log(`port ${port} is running!!!`)
});