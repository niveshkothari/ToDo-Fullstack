const express = require("express") ;
const router  = express.Router() ;
const bcrypt = require("bcrypt") ;
const User = require("../models/User") ;
const jwt = require("jsonwebtoken") ;


//register new user 

router.post("/register",async (req,res) => {
    try {
        const {username, email, password} = req.body ;

        // checking if user already exists ?
        const existingUser = await User.findOne({$or: [{email}, {username}]}) ;
        if(existingUser) return res.status(400).json({message: "user already exists"}) ;

        // Hash Password
        const salt = await bcrypt.genSalt(10) ;
        const hashedPassword = await bcrypt.hash(password,salt) ;

        //Create new user
        const newUser = new User({
            username,
            email,
            password:hashedPassword,
        });

        await newUser.save() ;
        res.status(201).json({message:"User successfully Registered"}) ;

    }catch (error) {
    res.status(500).json({ message: 'Server error' });
  }

}) ;

// Login route

router.post("/login", async (req,res) => {
    try {
        const {email, password} = req.body ;

        //find user by email
        const user = await User.findOne({email}) ;
        if(!user) return res.status(400).json({message:"Invalid email or Password"}) ;

        //Compare password
        const isMatch  = await bcrypt.compare(password, user.password) ;
        if(!isMatch) return res.status(400).json({message:"Invalid email or Password"}) ;

        //Generate JWT token
        const token = jwt.sign(
            {userId:user._id, username:user.username},
            process.env.JWT_SECRET,
            {expiresIn :'1h'}
        ) ;

        res.json({token, username: user.username , email: user.email}) ;

    }catch (error){
        res.status(500).json({message: "server error"}) ;
    }
}) ;

module.exports = router ;

