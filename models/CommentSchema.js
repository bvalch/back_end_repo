const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema=new Schema({

    hikeToComment:{
        type:String,
        required:true
    
    },
    comment:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
    },
    replies:{
        type:Array
    },
    author_id:{
        type:String,
        required:true
    },
    author_name:{
        type:String,
        required:true
    }

})

module.exports = mongoose.model("Comment",commentSchema)