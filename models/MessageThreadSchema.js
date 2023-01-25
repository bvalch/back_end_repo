const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageThreadSchema=new Schema({

    messageThreadId:{
        type:String,
        required:true
    
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