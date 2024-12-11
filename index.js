if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
// import packages
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const Admin = require('./models/admin.js')
const Lesson = require('./models/lesson.js')
const User = require('./models/newUser.js')
const Vocabulary = require('./models/vocabulary.js')

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


app.get("/demouser", async (req, res) => {
    try {
        let demo = new Lesson({
            lessonNumber: 1,
            lessonTitle: "lesson title" // Set admin status if needed
        });

        await demo.save(); // Save to MongoDB
        res.send(demo);

        
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating admin user");
    }
});



app.get('/',(req, res)=>{
    res.send('This is a root route');
})

app.listen(port, ()=>{
    console.log(`port ${port} is running!!!`)
});