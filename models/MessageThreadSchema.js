const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageThreadSchema=new Schema({

    messageThreadId:{
        type:String,
        required:true
    
    },
    messageThreadDate:{
        type:String,
        required:true
    },
    messageThreadTitle:{
        type:String,
    },
    messageThreadParties:{
        type:Array,
        required:true
    },
    threadMessages:{
        type:Array,
        required:true
    }

})

module.exports = mongoose.model("MessageThread",messageThreadSchema)