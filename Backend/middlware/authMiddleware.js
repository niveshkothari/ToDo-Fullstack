const jwt = require("jsonwebtoken"); 

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.replace('Bearer ','') ;
    if(!token) return res.status(401).json({message:"No Token, Authorization Denied"}) ;

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET) ;
        req.user = decoded ; //attach user info to request
        next() ;
    }catch(error){
        res.status(401).json({message:"Token is not valid"})
    }
} ;

module.exports = authMiddleware ;