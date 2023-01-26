const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const hikeSchema = new Schema({

    hikeOrigin: {
        type: String,
        required: true

    },
    hikeDestination: {
        type: String,
        required: true
    },
    hikeInfo: {
        type: String
    },
    hikeAtt:{
        type:Array
    },
    hikeOwner:{
    type:String,
    required:true
    },
    hikeTransport:{
        type:String
    },
    hikeDate: {
        type: String
    },
    hikeTime: {
        type: String
    },
    hikeComments:{
        type:Array
    },
    hikeOwnerId:{
        type:String,
        required:true
    },
    hikeCover:{
        type:String
    },



});

module.exports = mongoose.model('Hike', hikeSchema);