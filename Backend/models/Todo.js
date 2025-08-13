const mongoose = require("mongoose") ;

const todoschema = mongoose.Schema({
    task: {
        type:String,
        required:true
    },
    completed: {
        type:Boolean,
        default:false
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, ref: 'User' 
    }

},{timestamps:true}) ;

module.exports = mongoose.model("Todo",todoschema) ;