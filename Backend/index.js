const express = require("express") ;
const mongoose = require("mongoose") ;
const cors = require("cors") ;
require("dotenv").config() ;

const app = express() ;
const PORT = process.env.PORT || 5000 ; 

app.use(cors()) ;
app.use(express.json()) ;

app.get("/",(req,res) => {
    res.send("Hi from backend") ;
})

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Database Connected");
    app.listen(PORT, () =>{
        console.log(`Listening on ${PORT}`) ;
    })
})
.catch(err => {
    console.error("MongoDb  Connection error:", err) ;
})

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const todoRoutes = require("./routes/todoRoutes");
app.use("/api/todos", todoRoutes);


