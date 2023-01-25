const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const profileSchema = new Schema({

    personName: {
        type: String,
        required:true
    },
    personAge: {
        type: Number,
        required:true

    },
    personLocation: {
        type: String,
        required:true

    },
    personInfo: {
        type: String,
        required:true

    },
    profileOwnerId: {
        type: String,
        required:true
    },
    profileOwnerAlias:{
        type:String,
        required:true
    },
    profilePhoto:{
        type:String
    }

});

module.exports = mongoose.model('Profile', profileSchema);