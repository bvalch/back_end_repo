const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const profileSchema = new Schema({

    personName: {
        type: String,
    },
    personAge: {
        type: Number,
    },
    personLocation: {
        type: String
    },
    personInfo: {
        type: String
    },
    profileOwner: {
        type: String
    }

});

module.exports = mongoose.model('Profile', profileSchema);